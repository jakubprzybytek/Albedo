package jp.albedo.utils;

@FunctionalInterface
public interface CheckedSupplier<T> {
    T get() throws Exception;
}