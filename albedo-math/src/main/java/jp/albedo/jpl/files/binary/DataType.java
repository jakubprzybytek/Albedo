package jp.albedo.jpl.files.binary;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum DataType {

    PositionChebyshevPosition(2),
    PositionAndVelocityChebyshevPosition(3);

    public final int id;

    private static final Map<Integer, DataType> lookup = Arrays.stream(DataType.values())
            .collect(Collectors.toMap(dataType -> dataType.id, Function.identity()));


    DataType(int id) {
        this.id = id;
    }

    public static DataType forId(int id) {
        if (!lookup.containsKey(id)) {
            throw new UnsupportedOperationException("Unknown data type id: " + id);
        }

        return lookup.get(id);
    }

}
