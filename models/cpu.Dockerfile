# FROM nvcr.io/nvidia/pytorch:22.12-py3
# RUN pip uninstall -y torch
# RUN pip install vllm

FROM pytorch/pytorch:latest
RUN pip install -U pip
# ENV DEBIAN_FRONTEND=noninteractive
# RUN apt update -y && apt -y upgrade
# RUN apt install -y software-properties-common

# RUN add-apt-repository -y ppa:deadsnakes/ppa

# RUN DEBIAN_FRONTEND=noninteractive apt install --yes --quiet --no-install-recommends \
#   python3.10 \
#   python3.10-dev \
#   python3.10-distutils \
#   python3.10-lib2to3 \
#   python3.10-gdbm \
#   python3.10-tk \
#   pip

RUN pip install fschat einops
# RUN pip install vllm

# Fix a bug in fastchat
RUN pip install pydantic-settings
RUN sed -i 's/from pydantic import BaseSettings/from pydantic_settings import BaseSettings/' /opt/conda/lib/python3.10/site-packages/fastchat/serve/openai_api_server.py
RUN sed -i 's/api_keys: List\[str\] = None/api_keys: List\[str\] = []/g' /opt/conda/lib/python3.10/site-packages/fastchat/serve/openai_api_server.py
