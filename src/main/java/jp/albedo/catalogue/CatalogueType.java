package jp.albedo.catalogue;

import java.util.Set;
import java.util.stream.Collectors;

public enum CatalogueType {

    IC,
    NGC,
    Messier;

    public static Set<CatalogueType> parse(Set<String> strings) {
        return strings.stream()
                .map(CatalogueType::valueOf)
                .collect(Collectors.toSet());
    }
}
