FROM openvino/ubuntu22_dev:latest

USER root
COPY assets ./assets
RUN python3 -m pip install --upgrade --no-cache-dir pip
RUN python3 -m pip install --upgrade --no-cache-dir -r assets/openvino-requirements.txt

USER openvino
WORKDIR /home/openvino
RUN echo "always run the line below"
RUN git clone https://github.com/rad-ninjas/FastChat.git --branch openvino-worker --depth 1

