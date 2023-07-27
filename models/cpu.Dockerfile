FROM pytorch/pytorch:latest

RUN apt update
RUN apt install -y dos2unix


RUN pip install -U pip
RUN pip install fschat einops
RUN pip install pydantic==1.10.12

# Fix a bug in fastchat
# RUN pip install pydantic-settings
# RUN sed -i 's/from pydantic import BaseSettings/from pydantic_settings import BaseSettings/' /opt/conda/lib/python3.10/site-packages/fastchat/serve/openai_api_server.py
# RUN sed -i 's/api_keys: List\[str\] = None/api_keys: List\[str\] = []/g' /opt/conda/lib/python3.10/site-packages/fastchat/serve/openai_api_server.py

COPY scripts/start-cpu-worker.sh start.sh

RUN dos2unix start.sh