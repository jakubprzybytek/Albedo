package jp.albedo.utils;

import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

public class FunctionUtils {

    public static <T> Supplier<T> wrapSupplier(CheckedSupplier<T> checkedSupplied) {
        return () -> {
            try {
                return checkedSupplied.get();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
    }

    public static <T> Consumer<T> wrapConsumer(CheckedConsumer<T> checkedConsumer) {
        return t -> {
            try {
                checkedConsumer.accept(t);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
    }

    public static <T, R> Function<T, R> wrap(CheckedFunction<T, R> checkedFunction) {
        return t -> {
            try {
                return checkedFunction.apply(t);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        };
    }

}
