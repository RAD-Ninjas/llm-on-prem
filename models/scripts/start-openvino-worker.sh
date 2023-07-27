#!/bin/bash

python3 -c "from huggingface_hub._login import _login; import os; _login(token=os.getenv('HF_TOKEN'), add_to_git_credential=False)";

python3 FastChat/fastchat/serve/openvino_worker.py \
 --model-names ${MODEL_NAME} \
 --model-path ${IR_PATH} \
 --worker-address http://fastchat-model-worker-openvino:21002 \
 --controller-address http://fastchat-controller:21001 \
 --device ${DEVICE} \
 --host "0.0.0.0" \
 --port 21002;
