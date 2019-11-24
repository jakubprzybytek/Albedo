package jp.albedo.utils;

@FunctionalInterface
public interface CheckedConsumer<T> {
    void accept(T t) throws Exception;
}
