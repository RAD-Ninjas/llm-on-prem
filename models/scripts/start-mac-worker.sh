#!/bin/bash
#
set -e

python hf_login.py

source ../../.env.mac
python                                                      \
    -m fastchat.serve.model_worker                          \
    --model-names ${MODEL_NAME}                             \
    --model-path ${MODEL_PATH}                              \
    --worker-address http://localhost:21002                 \
    --controller-address http://localhost:21001             \
    --limit-worker-concurrency ${CPU_THREADS}               \
    --device "mps"                                          \
    --load-8bit                                             \
    --host "0.0.0.0"                                        \
    --port 21002

set +e
