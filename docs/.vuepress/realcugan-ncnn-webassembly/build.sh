#!/bin/sh

./emsdk/emsdk install latest
./emsdk/emsdk activate latest

source ./emsdk/emsdk_env.sh

target_dir="../../public/tools"
mkdir -p ./build ../../public/tools
(cd ./build && \
cmake -DCMAKE_TOOLCHAIN_FILE=$EMSDK/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake -DWASM_FEATURE=simd-threads -DNCNN_THREADS=ON -DNCNN_OPENMP=ON -DNCNN_SIMPLEOMP=ON -DNCNN_RUNTIME_CPU=OFF -DNCNN_SSE2=ON -DNCNN_AVX2=OFF -DNCNN_AVX=OFF -DNCNN_BUILD_TOOLS=OFF -DNCNN_BUILD_EXAMPLES=OFF -DNCNN_BUILD_BENCHMARK=OFF -DNCNN_TTT=ON .. && \
make -j4 && \
mkdir -p $target_dir && \
cp realcugan-ncnn-webassembly* $target_dir && \
cp ../models/* $target_dir)
