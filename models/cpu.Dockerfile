

FROM pytorch/pytorch:latest
RUN pip install -U pip

RUN pip install fschat einops

# Fix a bug in fastchat
RUN pip install pydantic-settings
RUN sed -i 's/from pydantic import BaseSettings/from pydantic_settings import BaseSettings/' /opt/conda/lib/python3.10/site-packages/fastchat/serve/openai_api_server.py
RUN sed -i 's/api_keys: List\[str\] = None/api_keys: List\[str\] = []/g' /opt/conda/lib/python3.10/site-packages/fastchat/serve/openai_api_server.py

# ARG HF_TOKEN
# ENV HF_TOKEN=$HF_TOKEN

# RUN echo $HF_TOKEN

# # Log into huggingface using the token
# RUN python3 -c "from huggingface_hub._login import _login; import os; _login(token=os.getenv('HF_TOKEN'), add_to_git_credential=False)"

COPY scripts/start-cpu-worker.sh start.sh