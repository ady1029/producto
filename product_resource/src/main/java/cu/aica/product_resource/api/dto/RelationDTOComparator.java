package cu.aica.product_resource.api.dto;

import java.util.Comparator;

public class RelationDTOComparator implements Comparator<RelationDTO> {

    private final String sort;
    private final String sortBy;


    public RelationDTOComparator(String sort, String sortBy) {
        this.sort = sort;
        this.sortBy = sortBy;
    }


    public int compare(RelationDTO item1, RelationDTO item2) {
        if (sortBy.equals("productFamilyEnterprise"))
            return sort.equals("asc") ? item1.getProductFamilyEnterprise().compareTo(item2.getProductFamilyEnterprise()) : item2.getProductFamilyEnterprise().compareTo(item1.getProductFamilyEnterprise());
        else if (sortBy.equals("productFamilyName"))
            return sort.equals("asc") ? item1.getProductFamilyName().compareTo(item2.getProductFamilyName()) : item2.getProductFamilyName().compareTo(item1.getProductFamilyName());
        else if (sortBy.equals("name"))
            return sort.equals("asc") ? item1.getName().compareTo(item2.getName()) : item2.getName().compareTo(item1.getName());
        else if (sortBy.equals("criterio"))
            return sort.equals("asc") ? item1.getCriterio().compareTo(item2.getCriterio()) : item2.getCriterio().compareTo(item1.getCriterio());
        else if (sortBy.equals("date"))
            return sort.equals("asc") ? item1.getDate().compareTo(item2.getDate()) : item2.getDate().compareTo(item1.getDate());
        else if (sortBy.equals("baseCount"))
            return sort.equals("asc") ? Integer.compare(item1.getBaseCount(), item2.getBaseCount()) : Integer.compare(item2.getBaseCount(), item1.getBaseCount());
        else if (sortBy.equals("resourceFamilyName")){
            String rf1 = item1.getResourceFamilyName() != null ? item1.getResourceFamilyName() : "";
            String rf2 = item2.getResourceFamilyName() != null ? item2.getResourceFamilyName() : "";
            return sort.equals("asc") ? rf1.compareTo(rf2) : rf2.compareTo(rf1);
        } else
            return sort.equals("asc") ? Integer.compare(item1.getId(), item2.getId()) : Integer.compare(item2.getId(), item1.getId());
    }
}
