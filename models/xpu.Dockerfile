
FROM intel/intel-extension-for-pytorch:xpu-flex
RUN pip install -U pip
RUN pip install fschat einops
RUN pip install torch==1.13.0a0+git6c9b55e intel_extension_for_pytorch==1.13.120+xpu \
	-f https://developer.intel.com/ipex-whl-stable-xpu
# Fix a bug in fastchat
RUN pip install pydantic-settings
RUN sed -i 's/from pydantic import BaseSettings/from pydantic_settings import BaseSettings/' /usr/local/lib/python3.10/dist-packages/fastchat/serve/openai_api_server.py
RUN sed -i 's/api_keys: List\[str\] = None/api_keys: List\[str\] = []/g' /usr/local/lib/python3.10/dist-packages/fastchat/serve/openai_api_server.py

RUN apt update && 						\
	git clone https://github.com/unrahul/xpu_verify && 	\
	cd xpu_verify &&					\
	./xpu_verify.sh -f

# ARG HF_TOKEN
# ENV HF_TOKEN=$HF_TOKEN

# RUN echo $HF_TOKEN

# # Log into huggingface using the token
# RUN python3 -c "from huggingface_hub._login import _login; import os; _login(token=os.getenv('HF_TOKEN'), add_to_git_credential=False)"

COPY scripts/start-xpu-worker.sh start.sh
