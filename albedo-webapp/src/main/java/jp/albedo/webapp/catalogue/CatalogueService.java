package jp.albedo.webapp.catalogue;

import io.leangen.graphql.annotations.GraphQLArgument;
import jp.albedo.catalogue.Catalogue;
import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.catalogue.CatalogueName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CatalogueService {

    @Autowired
    private DsoCatalogueRepository dsoCatalogueRepository;

    public List<CatalogueEntry> allCatalogueEntries() throws IOException {
        Catalogue catalogue = this.dsoCatalogueRepository.getCatalogue(CatalogueName.NGC);
        return catalogue.getAllEntries();
    }

    public List<CatalogueEntry> filteredCatalogueEntries(@GraphQLArgument(name = "nameFilter") String nameFilter) throws IOException {
        Catalogue catalogue = this.dsoCatalogueRepository.getCatalogue(CatalogueName.NGC);
        return catalogue.getAllEntries().stream()
                .filter(catalogueEntry -> catalogueEntry.name.contains(nameFilter))
                .collect(Collectors.toList());
    }

}
