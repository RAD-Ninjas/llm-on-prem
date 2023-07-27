#!/bin/bash

python3 -c "from huggingface_hub._login import _login; import os; _login(token=os.getenv('HF_TOKEN'), add_to_git_credential=False)";

python3 \
 -m fastchat.serve.model_worker \
 --model-names ${MODEL_NAME} \
 --model-path ${MODEL_PATH} \
 --worker-address http://fastchat-model-worker-xpu:21002 \
 --controller-address http://fastchat-controller:21001 \
 --device "xpu" \
 --host "0.0.0.0" \
 --port 21002;

# --worker-address http://fastchat-model-worker-cpu:21002 \
# --controller-address http://fastchat-controller:21001 \
