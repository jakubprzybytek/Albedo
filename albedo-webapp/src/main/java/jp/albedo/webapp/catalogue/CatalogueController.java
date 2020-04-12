package jp.albedo.webapp.catalogue;

import jp.albedo.catalogue.Catalogue;
import jp.albedo.catalogue.CatalogueEntry;
import jp.albedo.catalogue.CatalogueName;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class CatalogueController {

    private static Log LOG = LogFactory.getLog(CatalogueController.class);

    @Autowired
    private CatalogueRepository catalogueRepository;

    @RequestMapping(method = RequestMethod.GET, path = "/api/catalogue")
    public List<CatalogueEntry> separation(@RequestParam(value = "catalogueName", defaultValue = "") String catalogueNameString,
                                           @RequestParam(value = "nameFilter", defaultValue = "") String nameFilter) throws Exception {

        final CatalogueName catalogueName = CatalogueName.valueOf(catalogueNameString);
        final Catalogue catalogue = this.catalogueRepository.getCatalogue(catalogueName);

        LOG.info(String.format("Returning catalogue entries, params: [catalogueName=%s, nameFilter=\"%s\"]", catalogueName, nameFilter));

        return catalogue.getAllEntries().stream()
                .filter(catalogueEntry -> catalogueEntry.name.contains(nameFilter))
                .collect(Collectors.toList());
    }

}
