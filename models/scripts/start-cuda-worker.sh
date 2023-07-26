#!/bin/bash

python3 -c "from huggingface_hub._login import _login; import os; _login(token=os.getenv('HF_TOKEN'), add_to_git_credential=False)";

python3 \
-m fastchat.serve.vllm_worker \
--model-names ${FASTCHAT_WORKER_MODEL_NAMES:-Llama-2-7b-chat-hf} \
--model-path meta-llama/Llama-2-7b-chat-hf \
--worker-address http://fastchat-model-worker-cuda:21002 \
--controller-address http://fastchat-controller:21001 \
--device cuda \
--host "0.0.0.0" \
--port 21002