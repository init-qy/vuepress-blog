#include "realcugan.h"
#include <cfloat>
#include <cpu.h>
#include <iostream>
#include <thread>
#include <string>
#include "fmt/core.h"

RealCUGAN::RealCUGAN()
{
  std::cout << "cpu count: " << ncnn::get_big_cpu_count() << std::endl;
  ncnn::set_cpu_powersave(2);
  ncnn::set_omp_num_threads(ncnn::get_big_cpu_count());

  ncnnNet.opt = ncnn::Option();
  ncnnNet.opt.num_threads = ncnn::get_big_cpu_count();

  bicubic_2x = 0;
  bicubic_3x = 0;
  bicubic_4x = 0;
}
RealCUGAN::~RealCUGAN()
{
  // cleanup preprocess and postprocess pipeline

  bicubic_2x->destroy_pipeline(ncnnNet.opt);
  delete bicubic_2x;

  bicubic_3x->destroy_pipeline(ncnnNet.opt);
  delete bicubic_3x;

  bicubic_4x->destroy_pipeline(ncnnNet.opt);
  delete bicubic_4x;
}

void progress_callback(long total_cost, long tile_cost, float progress_rate)
{
  // callback by stdout =_=
  long remaining_time = 0;
  if (progress_rate != 0)
  {
    remaining_time = float(total_cost) / progress_rate - (float)total_cost;
  }
  std::string script = fmt::format(R"($CALLBACK$ {{"eventType":"PROC_PROGRESS","total_cost":{},"tile_cost":{},"progress_rate":{},"remaining_time":{}}})",
                                   total_cost, tile_cost, progress_rate, remaining_time);
  std::cout << script << std::endl;
}

int RealCUGAN::load(int scaleOption, int noiseOption)
{
  ncnnNet.opt.use_vulkan_compute = false;
  ncnnNet.opt.use_fp16_packed = true;
  ncnnNet.opt.use_fp16_storage = false;
  ncnnNet.opt.use_fp16_arithmetic = false;
  ncnnNet.opt.use_int8_storage = true;
  ncnnNet.clear();
  this->scale = scaleOption;
  this->noise = noiseOption;

  std::string paramFilePath;
  std::string binFilePath;
  if (this->noise == 0)
  {
    paramFilePath = fmt::format("up{}x-no-denoise.param", this->scale);
    binFilePath = fmt::format("up{}x-no-denoise.bin", this->scale);
  }
  else if (this->noise == -1)
  {
    paramFilePath = fmt::format("up{}x-conservative.param", this->scale);
    binFilePath = fmt::format("up{}x-conservative.bin", this->scale);
  }
  else
  {
    paramFilePath = fmt::format("up{}x-denoise{}x.param", this->scale, this->noise);
    binFilePath = fmt::format("up{}x-denoise{}x.bin", this->scale, this->noise);
  }
  ncnnNet.load_param(paramFilePath.c_str());
  ncnnNet.load_model(binFilePath.c_str());

  if (scale == 2)
  {
    this->prepadding = 18;
  }
  else if (scale == 3)
  {
    this->prepadding = 14;
  }
  else if (scale == 4)
  {
    this->prepadding = 19;
  }
  return 0;
}

// CPU only
int RealCUGAN::process(const ncnn::Mat &inimage, ncnn::Mat &outimage)
{
  std::chrono::steady_clock::time_point begin = std::chrono::steady_clock::now();
  const unsigned char *pixeldata = (const unsigned char *)inimage.data;
  const int w = inimage.w;
  const int h = inimage.h;
  const int channels = inimage.elempack;

  std::cout << "image size: " << w << " * " << h << " , channels: " << channels << std::endl;

  const int TILE_SIZE_X = tilesize;
  const int TILE_SIZE_Y = tilesize;

  ncnn::Option opt = ncnnNet.opt;

  // each tile 200x200
  const int xtiles = (w + TILE_SIZE_X - 1) / TILE_SIZE_X;
  const int ytiles = (h + TILE_SIZE_Y - 1) / TILE_SIZE_Y;

  for (int yi = 0; yi < ytiles; yi++)
  {
    const int tile_h_nopad = std::min((yi + 1) * TILE_SIZE_Y, h) - yi * TILE_SIZE_Y;

    int prepadding_bottom = prepadding;
    if (scale == 1 || scale == 3)
    {
      prepadding_bottom += (tile_h_nopad + 3) / 4 * 4 - tile_h_nopad;
    }
    if (scale == 2 || scale == 4)
    {
      prepadding_bottom += (tile_h_nopad + 1) / 2 * 2 - tile_h_nopad;
    }

    int in_tile_y0 = std::max(yi * TILE_SIZE_Y - prepadding, 0);
    int in_tile_y1 = std::min((yi + 1) * TILE_SIZE_Y + prepadding_bottom, h);

    for (int xi = 0; xi < xtiles; xi++)
    {
      std::chrono::steady_clock::time_point tileBegin = std::chrono::steady_clock::now();
      const int tile_w_nopad = std::min((xi + 1) * TILE_SIZE_X, w) - xi * TILE_SIZE_X;

      int prepadding_right = prepadding;
      if (scale == 1 || scale == 3)
      {
        prepadding_right += (tile_w_nopad + 3) / 4 * 4 - tile_w_nopad;
      }
      if (scale == 2 || scale == 4)
      {
        prepadding_right += (tile_w_nopad + 1) / 2 * 2 - tile_w_nopad;
      }

      int in_tile_x0 = std::max(xi * TILE_SIZE_X - prepadding, 0);
      int in_tile_x1 = std::min((xi + 1) * TILE_SIZE_X + prepadding_right, w);

      // crop tile
      ncnn::Mat in;
      {
        if (channels == 3)
        {
#if _WIN32
          in = ncnn::Mat::from_pixels_roi(pixeldata, ncnn::Mat::PIXEL_BGR2RGB, w, h, in_tile_x0, in_tile_y0, in_tile_x1 - in_tile_x0, in_tile_y1 - in_tile_y0);
#else
          in = ncnn::Mat::from_pixels_roi(pixeldata, ncnn::Mat::PIXEL_RGB, w, h, in_tile_x0, in_tile_y0, in_tile_x1 - in_tile_x0, in_tile_y1 - in_tile_y0);
#endif
        }
        if (channels == 4)
        {
#if _WIN32
          in = ncnn::Mat::from_pixels_roi(pixeldata, ncnn::Mat::PIXEL_BGRA2RGBA, w, h, in_tile_x0, in_tile_y0, in_tile_x1 - in_tile_x0, in_tile_y1 - in_tile_y0);
#else
          in = ncnn::Mat::from_pixels_roi(pixeldata, ncnn::Mat::PIXEL_RGBA, w, h, in_tile_x0, in_tile_y0, in_tile_x1 - in_tile_x0, in_tile_y1 - in_tile_y0);
#endif
        }
      }

      ncnn::Mat out;

      if (tta_mode)
      {
        // split alpha and preproc
        ncnn::Mat in_tile[8];
        ncnn::Mat in_alpha_tile;
        {
          in_tile[0].create(in.w, in.h, 3);
          for (int q = 0; q < 3; q++)
          {
            const float *ptr = in.channel(q);
            float *outptr0 = in_tile[0].channel(q);

            for (int i = 0; i < in.h; i++)
            {
              for (int j = 0; j < in.w; j++)
              {
                *outptr0++ = *ptr++ * (1 / 255.f);
              }
            }
          }

          if (channels == 4)
          {
            in_alpha_tile = in.channel_range(3, 1).clone();
          }
        }

        // border padding
        {
          int pad_top = std::max(prepadding - yi * TILE_SIZE_Y, 0);
          int pad_bottom = std::max(std::min((yi + 1) * TILE_SIZE_Y + prepadding_bottom - h, prepadding_bottom), 0);
          int pad_left = std::max(prepadding - xi * TILE_SIZE_X, 0);
          int pad_right = std::max(std::min((xi + 1) * TILE_SIZE_X + prepadding_right - w, prepadding_right), 0);

          ncnn::Mat in_tile_padded;
          ncnn::copy_make_border(in_tile[0], in_tile_padded, pad_top, pad_bottom, pad_left, pad_right, 2, 0.f, ncnnNet.opt);
          in_tile[0] = in_tile_padded;
        }

        // the other 7 directions
        {
          in_tile[1].create(in_tile[0].w, in_tile[0].h, 3);
          in_tile[2].create(in_tile[0].w, in_tile[0].h, 3);
          in_tile[3].create(in_tile[0].w, in_tile[0].h, 3);
          in_tile[4].create(in_tile[0].h, in_tile[0].w, 3);
          in_tile[5].create(in_tile[0].h, in_tile[0].w, 3);
          in_tile[6].create(in_tile[0].h, in_tile[0].w, 3);
          in_tile[7].create(in_tile[0].h, in_tile[0].w, 3);

          for (int q = 0; q < 3; q++)
          {
            const ncnn::Mat in_tile_0 = in_tile[0].channel(q);
            ncnn::Mat in_tile_1 = in_tile[1].channel(q);
            ncnn::Mat in_tile_2 = in_tile[2].channel(q);
            ncnn::Mat in_tile_3 = in_tile[3].channel(q);
            ncnn::Mat in_tile_4 = in_tile[4].channel(q);
            ncnn::Mat in_tile_5 = in_tile[5].channel(q);
            ncnn::Mat in_tile_6 = in_tile[6].channel(q);
            ncnn::Mat in_tile_7 = in_tile[7].channel(q);

            for (int i = 0; i < in_tile[0].h; i++)
            {
              const float *outptr0 = in_tile_0.row(i);
              float *outptr1 = in_tile_1.row(in_tile[0].h - 1 - i);
              float *outptr2 = in_tile_2.row(i) + in_tile[0].w - 1;
              float *outptr3 = in_tile_3.row(in_tile[0].h - 1 - i) + in_tile[0].w - 1;

              for (int j = 0; j < in_tile[0].w; j++)
              {
                float *outptr4 = in_tile_4.row(j) + i;
                float *outptr5 = in_tile_5.row(in_tile[0].w - 1 - j) + i;
                float *outptr6 = in_tile_6.row(j) + in_tile[0].h - 1 - i;
                float *outptr7 = in_tile_7.row(in_tile[0].w - 1 - j) + in_tile[0].h - 1 - i;

                float v = *outptr0++;

                *outptr1++ = v;
                *outptr2-- = v;
                *outptr3-- = v;
                *outptr4 = v;
                *outptr5 = v;
                *outptr6 = v;
                *outptr7 = v;
              }
            }
          }
        }

        // realcugan
        ncnn::Mat out_tile[8];
        for (int ti = 0; ti < 8; ti++)
        {
          ncnn::Extractor ex = ncnnNet.create_extractor();

          ex.input("in0", in_tile[ti]);

          ex.extract("out0", out_tile[ti]);
        }

        ncnn::Mat out_alpha_tile;
        if (channels == 4)
        {
          if (scale == 1)
          {
            out_alpha_tile = in_alpha_tile;
          }
          if (scale == 2)
          {
            bicubic_2x->forward(in_alpha_tile, out_alpha_tile, opt);
          }
          if (scale == 3)
          {
            bicubic_3x->forward(in_alpha_tile, out_alpha_tile, opt);
          }
          if (scale == 4)
          {
            bicubic_4x->forward(in_alpha_tile, out_alpha_tile, opt);
          }
        }

        // postproc and merge alpha
        {
          out.create(tile_w_nopad * scale, tile_h_nopad * scale, channels);
          if (scale == 4)
          {
            for (int q = 0; q < 3; q++)
            {
              const ncnn::Mat out_tile_0 = out_tile[0].channel(q);
              const ncnn::Mat out_tile_1 = out_tile[1].channel(q);
              const ncnn::Mat out_tile_2 = out_tile[2].channel(q);
              const ncnn::Mat out_tile_3 = out_tile[3].channel(q);
              const ncnn::Mat out_tile_4 = out_tile[4].channel(q);
              const ncnn::Mat out_tile_5 = out_tile[5].channel(q);
              const ncnn::Mat out_tile_6 = out_tile[6].channel(q);
              const ncnn::Mat out_tile_7 = out_tile[7].channel(q);
              float *outptr = out.channel(q);

              for (int i = 0; i < out.h; i++)
              {
                const float *inptr = in_tile[0].channel(q).row(prepadding + i / 4) + prepadding;
                const float *ptr0 = out_tile_0.row(i);
                const float *ptr1 = out_tile_1.row(out_tile[0].h - 1 - i);
                const float *ptr2 = out_tile_2.row(i) + out_tile[0].w - 1;
                const float *ptr3 = out_tile_3.row(out_tile[0].h - 1 - i) + out_tile[0].w - 1;

                for (int j = 0; j < out.w; j++)
                {
                  const float *ptr4 = out_tile_4.row(j) + i;
                  const float *ptr5 = out_tile_5.row(out_tile[0].w - 1 - j) + i;
                  const float *ptr6 = out_tile_6.row(j) + out_tile[0].h - 1 - i;
                  const float *ptr7 = out_tile_7.row(out_tile[0].w - 1 - j) + out_tile[0].h - 1 - i;

                  float v = (*ptr0++ + *ptr1++ + *ptr2-- + *ptr3-- + *ptr4 + *ptr5 + *ptr6 + *ptr7) / 8;

                  *outptr++ = v * 255.f + 0.5f + inptr[j / 4] * 255.f;
                }
              }
            }
          }
          else
          {
            for (int q = 0; q < 3; q++)
            {
              const ncnn::Mat out_tile_0 = out_tile[0].channel(q);
              const ncnn::Mat out_tile_1 = out_tile[1].channel(q);
              const ncnn::Mat out_tile_2 = out_tile[2].channel(q);
              const ncnn::Mat out_tile_3 = out_tile[3].channel(q);
              const ncnn::Mat out_tile_4 = out_tile[4].channel(q);
              const ncnn::Mat out_tile_5 = out_tile[5].channel(q);
              const ncnn::Mat out_tile_6 = out_tile[6].channel(q);
              const ncnn::Mat out_tile_7 = out_tile[7].channel(q);
              float *outptr = out.channel(q);

              for (int i = 0; i < out.h; i++)
              {
                const float *ptr0 = out_tile_0.row(i);
                const float *ptr1 = out_tile_1.row(out_tile[0].h - 1 - i);
                const float *ptr2 = out_tile_2.row(i) + out_tile[0].w - 1;
                const float *ptr3 = out_tile_3.row(out_tile[0].h - 1 - i) + out_tile[0].w - 1;

                for (int j = 0; j < out.w; j++)
                {
                  const float *ptr4 = out_tile_4.row(j) + i;
                  const float *ptr5 = out_tile_5.row(out_tile[0].w - 1 - j) + i;
                  const float *ptr6 = out_tile_6.row(j) + out_tile[0].h - 1 - i;
                  const float *ptr7 = out_tile_7.row(out_tile[0].w - 1 - j) + out_tile[0].h - 1 - i;

                  float v = (*ptr0++ + *ptr1++ + *ptr2-- + *ptr3-- + *ptr4 + *ptr5 + *ptr6 + *ptr7) / 8;

                  *outptr++ = v * 255.f + 0.5f;
                }
              }
            }
          }

          if (channels == 4)
          {
            memcpy(out.channel_range(3, 1), out_alpha_tile, out_alpha_tile.total() * sizeof(float));
          }
        }
      }
      else
      {
        // split alpha and preproc
        ncnn::Mat in_tile;
        ncnn::Mat in_alpha_tile;
        {
          in_tile.create(in.w, in.h, 3);
          for (int q = 0; q < 3; q++)
          {
            const float *ptr = in.channel(q);
            float *outptr = in_tile.channel(q);

            for (int i = 0; i < in.w * in.h; i++)
            {
              *outptr++ = *ptr++ * (1 / 255.f);
            }
          }

          if (channels == 4)
          {
            in_alpha_tile = in.channel_range(3, 1).clone();
          }
        }

        // border padding
        {
          int pad_top = std::max(prepadding - yi * TILE_SIZE_Y, 0);
          int pad_bottom = std::max(std::min((yi + 1) * TILE_SIZE_Y + prepadding_bottom - h, prepadding_bottom), 0);
          int pad_left = std::max(prepadding - xi * TILE_SIZE_X, 0);
          int pad_right = std::max(std::min((xi + 1) * TILE_SIZE_X + prepadding_right - w, prepadding_right), 0);

          ncnn::Mat in_tile_padded;
          ncnn::copy_make_border(in_tile, in_tile_padded, pad_top, pad_bottom, pad_left, pad_right, 2, 0.f, ncnnNet.opt);
          in_tile = in_tile_padded;
        }

        // realcugan
        ncnn::Mat out_tile;
        {
          ncnn::Extractor ex = ncnnNet.create_extractor();

          ex.input("in0", in_tile);

          ex.extract("out0", out_tile);
        }

        ncnn::Mat out_alpha_tile;
        if (channels == 4)
        {
          if (scale == 1)
          {
            out_alpha_tile = in_alpha_tile;
          }
          if (scale == 2)
          {
            bicubic_2x->forward(in_alpha_tile, out_alpha_tile, opt);
          }
          if (scale == 3)
          {
            bicubic_3x->forward(in_alpha_tile, out_alpha_tile, opt);
          }
          if (scale == 4)
          {
            bicubic_4x->forward(in_alpha_tile, out_alpha_tile, opt);
          }
        }

        // postproc and merge alpha
        {
          out.create(tile_w_nopad * scale, tile_h_nopad * scale, channels);
          if (scale == 4)
          {
            for (int q = 0; q < 3; q++)
            {
              float *outptr = out.channel(q);

              for (int i = 0; i < out.h; i++)
              {
                const float *inptr = in_tile.channel(q).row(prepadding + i / 4) + prepadding;
                const float *ptr = out_tile.channel(q).row(i);

                for (int j = 0; j < out.w; j++)
                {
                  *outptr++ = *ptr++ * 255.f + 0.5f + inptr[j / 4] * 255.f;
                }
              }
            }
          }
          else
          {
            for (int q = 0; q < 3; q++)
            {
              float *outptr = out.channel(q);

              for (int i = 0; i < out.h; i++)
              {
                const float *ptr = out_tile.channel(q).row(i);

                for (int j = 0; j < out.w; j++)
                {
                  *outptr++ = *ptr++ * 255.f + 0.5f;
                }
              }
            }
          }

          if (channels == 4)
          {
            memcpy(out.channel_range(3, 1), out_alpha_tile, out_alpha_tile.total() * sizeof(float));
          }
        }
      }

      {
        if (channels == 3)
        {
#if _WIN32
          out.to_pixels((unsigned char *)outimage.data + yi * scale * TILE_SIZE_Y * w * scale * channels + xi * scale * TILE_SIZE_X * channels, ncnn::Mat::PIXEL_RGB2BGR, w * scale * channels);
#else
          out.to_pixels((unsigned char *)outimage.data + yi * scale * TILE_SIZE_Y * w * scale * channels + xi * scale * TILE_SIZE_X * channels, ncnn::Mat::PIXEL_RGB, w * scale * channels);
#endif
        }
        if (channels == 4)
        {
#if _WIN32
          out.to_pixels((unsigned char *)outimage.data + yi * scale * TILE_SIZE_Y * w * scale * channels + xi * scale * TILE_SIZE_X * channels, ncnn::Mat::PIXEL_RGBA2BGRA, w * scale * channels);
#else
          out.to_pixels((unsigned char *)outimage.data + yi * scale * TILE_SIZE_Y * w * scale * channels + xi * scale * TILE_SIZE_X * channels, ncnn::Mat::PIXEL_RGBA, w * scale * channels);
#endif
        }
      }
      auto end = std::chrono::steady_clock::now();
      auto tile_cost = std::chrono::duration_cast<std::chrono::milliseconds>(end - tileBegin).count();
      auto total_cost = std::chrono::duration_cast<std::chrono::milliseconds>(end - begin).count();
      float progress_rate = (float)(xtiles * yi + xi + 1) / (float)(xtiles * ytiles);
      progress_callback(total_cost, tile_cost, progress_rate);
    }
  }

  return 0;
}
