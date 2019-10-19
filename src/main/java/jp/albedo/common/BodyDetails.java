package jp.albedo.common;

public class BodyDetails {

    public String name;

    public BodyDetails(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }

}
