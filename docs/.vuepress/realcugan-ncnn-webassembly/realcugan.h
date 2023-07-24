#ifndef REALCUGAN_H
#define REALCUGAN_H

#include "net.h"

class RealCUGAN
{
public:
  RealCUGAN();
  ~RealCUGAN();

  int load(int scale, int noise);

  int process(const ncnn::Mat &inimage, ncnn::Mat &outimage);

  int noise;
  int scale;
  int prepadding;
  int tilesize = 200;
  int syncgap = 0;
  bool tta_mode = false;

private:
  ncnn::Net ncnnNet;
  ncnn::Layer *bicubic_2x;
  ncnn::Layer *bicubic_3x;
  ncnn::Layer *bicubic_4x;
};

#endif // REALCUGAN_H

typedef std::string path_t;
