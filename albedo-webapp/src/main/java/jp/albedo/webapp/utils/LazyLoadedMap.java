package jp.albedo.webapp.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;

public class LazyLoadedMap<T> {

    private final Supplier<Map<String, T>> mapSupplier;

    private Map<String, T> map;

    public LazyLoadedMap(Supplier<Map<String, T>> mapSupplier) {
        this.mapSupplier = mapSupplier;
    }

    public Optional<T> getByName(String name) {
        if (this.map == null) {
            this.map = loadMap();
        }

        return Optional.ofNullable(this.map.get(name));
    }

    public List<T> getAll() {
        if (this.map == null) {
            this.map = loadMap();
        }

        return new ArrayList<>(this.map.values());
    }

    private synchronized Map<String, T> loadMap() {
        if (this.map != null) {
            return this.map;
        }

        return this.mapSupplier.get();
    }

}
