package jp.albedo.jpl.files.binary;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum ReferenceFrame {

    J2000(1);

    public final int id;

    private static final Map<Integer, ReferenceFrame> lookup = Arrays.stream(ReferenceFrame.values())
            .collect(Collectors.toMap(dataType -> dataType.id, Function.identity()));

    ReferenceFrame(int id) {
        this.id = id;
    }

    public static ReferenceFrame forId(int id) {
        if (!lookup.containsKey(id)) {
            throw new UnsupportedOperationException("Unknown reference frame id: " + id);
        }

        return lookup.get(id);
    }

}
