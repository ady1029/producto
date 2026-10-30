package cu.aica.product_resource.api.dto.report;

import java.util.Comparator;

public class NationalDemandDTOComparator implements Comparator<NationalDemandDTO> {

    private final String sort;
    private final String sortBy;


    public NationalDemandDTOComparator(String sort, String sortBy) {
        this.sort = sort;
        this.sortBy = sortBy;
    }


    public int compare(NationalDemandDTO rf1, NationalDemandDTO rf2) {
        if (sortBy.equals("enterprise"))
            return sort.equals("asc") ? rf1.getEnterprise().compareTo(rf2.getEnterprise()) : rf2.getEnterprise().compareTo(rf1.getEnterprise());

        else if (sortBy.equals("relationCriterio"))
            return sort.equals("asc") ? rf1.getRelationCriterio().compareTo(rf2.getRelationCriterio()) : rf2.getRelationCriterio().compareTo(rf1.getRelationCriterio());

        else if (sortBy.equals("name"))
            return sort.equals("asc") ? rf1.getName().compareTo(rf2.getName()) : rf2.getName().compareTo(rf1.getName());

        else if (sortBy.equals("resourceType"))
            return sort.equals("asc") ? rf1.getResourceType().compareTo(rf2.getResourceType()) : rf2.getResourceType().compareTo(rf1.getResourceType());

        else if (sortBy.equals("order"))
            return sort.equals("asc") ? Integer.compare(rf1.getOrder(), rf2.getOrder()) : Integer.compare(rf2.getOrder(), rf1.getOrder());
        else
            return sort.equals("asc") ? Integer.compare(rf1.getId(), rf2.getId()) : Integer.compare(rf2.getId(), rf1.getId());
    }
}
