package cu.aica.product_resource.api.dto;

import java.util.Comparator;

public class ProductFamilyDTOComparator implements Comparator<ProductFamilyDTO> {

    private final String sort;
    private final String sortBy;


    public ProductFamilyDTOComparator(String sort, String sortBy) {
        this.sort = sort;
        this.sortBy = sortBy;
    }


    public int compare(ProductFamilyDTO pf1, ProductFamilyDTO pf2) {
        if (sortBy.equals("enterprise"))
            return sort.equals("asc") ? pf1.getEnterprise().compareTo(pf2.getEnterprise()) : pf2.getEnterprise().compareTo(pf1.getEnterprise());

        else if (sortBy.equals("uebs"))
            return sort.equals("asc") ? pf1.getUebs().compareTo(pf2.getUebs()) : pf2.getUebs().compareTo(pf1.getUebs());

        else if (sortBy.equals("name"))
            return sort.equals("asc") ? pf1.getName().compareTo(pf2.getName()) : pf2.getName().compareTo(pf1.getName());

        else if (sortBy.equals("pharmaceuticShape"))
            return sort.equals("asc") ? pf1.getPharmaceuticShape().compareTo(pf2.getPharmaceuticShape()) : pf2.getPharmaceuticShape().compareTo(pf1.getPharmaceuticShape());

        else if (sortBy.equals("format"))
            return sort.equals("asc") ? pf1.getFormat().compareTo(pf2.getFormat()) : pf2.getFormat().compareTo(pf1.getFormat());

        else if (sortBy.equals("nationalDemand")) {

            Integer nd1 = pf1.getNationalDemand() != null ? pf1.getNationalDemand() : 0;
            Integer nd2 = pf2.getNationalDemand() != null ? pf2.getNationalDemand() : 0;
            return sort.equals("asc") ? Integer.compare(nd1, nd2) : Integer.compare(nd2, nd1);

        }
        else
            return sort.equals("asc") ? Integer.compare(pf1.getId(), pf2.getId()) : Integer.compare(pf2.getId(), pf1.getId());
    }
}
