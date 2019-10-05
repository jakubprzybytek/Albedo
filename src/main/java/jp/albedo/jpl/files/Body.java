package jp.albedo.jpl.files;

public enum Body {

    Mercury(0),
    Venus(1),
    Earth(2),
    Mars(3);

    public final int index;

    private Body(int index) {
        this.index = index;
    }

}
