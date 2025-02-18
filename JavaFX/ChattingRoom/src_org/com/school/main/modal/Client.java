package com.school.main.modal;

import java.io.Serializable;
import java.util.function.Consumer;

public class Client extends NetworkConnection{

    private String ip;
    private int port;

    public Client(String ip, int port, Consumer<Serializable> onReceiveCallBack) {
        super(onReceiveCallBack);
        this.ip = ip;
        this.port = port;
    }

    @Override
    protected boolean isServer() {
        return false;
    }

    @Override
    protected String getIP() {
        return ip;
    }

    @Override
    protected int getPort() {
        return port;
    }
}
