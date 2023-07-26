#!/bin/bash

python3 -c "from huggingface_hub._login import _login; import os; _login(token=os.getenv('HF_TOKEN'), add_to_git_credential=False)";

python3 \
-m fastchat.serve.model_worker \
--model-names Llama-2-7b-chat-hf \
--model-path meta-llama/Llama-2-7b-chat-hf \
--worker-address http://localhost:21002 \
--controller-address http://localhost:21001 \
--limit-worker-concurrency ${CPU_THREADS} \
--device "cpu" \
--host "0.0.0.0" \
--port 21002;


# --worker-address http://fastchat-model-worker-cpu:21002 \
# --controller-address http://fastchat-controller:21001 \