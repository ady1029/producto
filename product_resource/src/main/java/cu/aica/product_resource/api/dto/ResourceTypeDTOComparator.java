package cu.aica.product_resource.api.dto;

import java.util.Comparator;

public class ResourceTypeDTOComparator implements Comparator<ResourceTypeDTO> {

    private final String sort;
    private final String sortBy;


    public ResourceTypeDTOComparator(String sort, String sortBy) {
        this.sort = sort;
        this.sortBy = sortBy;
    }


    public int compare(ResourceTypeDTO rt1, ResourceTypeDTO rt2) {

        if (sortBy.equals("enterprise"))
            return sort.equals("asc") ? rt1.getEnterprise().compareTo(rt2.getEnterprise()) : rt2.getEnterprise().compareTo(rt1.getEnterprise());

        else if (sortBy.equals("name"))
            return sort.equals("asc") ? rt1.getName().compareTo(rt2.getName()) : rt2.getName().compareTo(rt1.getName());

        else
            return sort.equals("asc") ? Integer.compare(rt1.getId(), rt2.getId()) : Integer.compare(rt2.getId(), rt1.getId());
    }
}
