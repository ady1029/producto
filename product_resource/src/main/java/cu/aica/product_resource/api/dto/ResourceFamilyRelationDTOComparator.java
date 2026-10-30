package cu.aica.product_resource.api.dto;

import java.util.Comparator;

public class ResourceFamilyRelationDTOComparator implements Comparator<ResourceFamilyRelationDTO> {

    private final String sort;
    private final String sortBy;


    public ResourceFamilyRelationDTOComparator(String sort, String sortBy) {
        this.sort = sort;
        this.sortBy = sortBy;
    }


    public int compare(ResourceFamilyRelationDTO rft1, ResourceFamilyRelationDTO rft2) {
        if (sortBy.equals("enterprise"))
            return sort.equals("asc") ? rft1.getEnterprise().compareTo(rft2.getEnterprise()) : rft2.getEnterprise().compareTo(rft1.getEnterprise());

        else if (sortBy.equals("name"))
            return sort.equals("asc") ? rft1.getName().compareTo(rft2.getName()) : rft2.getName().compareTo(rft1.getName());

        else if (sortBy.equals("resourceType"))
            return sort.equals("asc") ? rft1.getResourceType().compareTo(rft2.getResourceType()) : rft2.getResourceType().compareTo(rft1.getResourceType());

        else if (sortBy.equals("referenceCount")) {

            Double rc1 = rft1.getReferenceCount() != null ? rft1.getReferenceCount() : 0;
            Double rc2 = rft2.getReferenceCount() != null ? rft2.getReferenceCount() : 0;
            return sort.equals("asc") ? Double.compare(rc1, rc2) : Double.compare(rc2, rc1);

        }

        else if (sortBy.equals("measureUnit")) {

            String mu1 = rft1.getMeasureUnit() != null ? rft1.getMeasureUnit() : "";
            String mu2 = rft2.getMeasureUnit() != null ? rft2.getMeasureUnit() : "";
            return sort.equals("asc") ? mu1.compareTo(mu2) : mu2.compareTo(mu1);

        }

        else
            return sort.equals("asc") ? Integer.compare(rft1.getIdResourceFamily(), rft2.getIdResourceFamily()) : Integer.compare(rft2.getIdResourceFamily(), rft1.getIdResourceFamily());
    }
}