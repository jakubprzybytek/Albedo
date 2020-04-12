package jp.albedo.common;

public class BodyDetails {

    final public String name;

    final public BodyType bodyType;

    public BodyDetails(String name, BodyType bodyType) {
        this.name = name;
        this.bodyType = bodyType;
    }

    @Override
    public String toString() {
        return this.name;
    }

}
