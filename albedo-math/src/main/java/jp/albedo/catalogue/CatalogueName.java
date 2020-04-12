package jp.albedo.catalogue;

import java.util.Set;
import java.util.stream.Collectors;

public enum CatalogueName {

    IC,
    NGC,
    Messier;

    public static Set<CatalogueName> parse(Set<String> strings) {
        return strings.stream()
                .map(CatalogueName::valueOf)
                .collect(Collectors.toSet());
    }
}
