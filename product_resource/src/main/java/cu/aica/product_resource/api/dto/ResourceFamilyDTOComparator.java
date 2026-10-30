package cu.aica.product_resource.api.dto;

import java.util.Comparator;

public class ResourceFamilyDTOComparator implements Comparator<ResourceFamilyDTO> {

    private final String sort;
    private final String sortBy;


    public ResourceFamilyDTOComparator(String sort, String sortBy) {
        this.sort = sort;
        this.sortBy = sortBy;
    }


    public int compare(ResourceFamilyDTO rf1, ResourceFamilyDTO rf2) {
        if (sortBy.equals("enterprise"))
            return sort.equals("asc") ? rf1.getEnterprise().compareTo(rf2.getEnterprise()) : rf2.getEnterprise().compareTo(rf1.getEnterprise());

        else if (sortBy.equals("name"))
            return sort.equals("asc") ? rf1.getName().compareTo(rf2.getName()) : rf2.getName().compareTo(rf1.getName());

        else
            return sort.equals("asc") ? Integer.compare(rf1.getId(), rf2.getId()) : Integer.compare(rf2.getId(), rf1.getId());
    }
}
