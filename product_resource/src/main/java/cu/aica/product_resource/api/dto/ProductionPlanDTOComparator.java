package cu.aica.product_resource.api.dto;

import java.util.Comparator;

public class ProductionPlanDTOComparator implements Comparator<ProductionPlanDTO> {

    private final String sort;
    private final String sortBy;


    public ProductionPlanDTOComparator(String sort, String sortBy) {
        this.sort = sort;
        this.sortBy = sortBy;
    }


    public int compare(ProductionPlanDTO pf1, ProductionPlanDTO pf2) {
        if (sortBy.equals("enterprise"))
            return sort.equals("asc") ? pf1.getEnterprise().compareTo(pf2.getEnterprise()) : pf2.getEnterprise().compareTo(pf1.getEnterprise());

        else if (sortBy.equals("name"))
            return sort.equals("asc") ? pf1.getName().compareTo(pf2.getName()) : pf2.getName().compareTo(pf1.getName());

        else if (sortBy.equals("planThisYear")) {
            return sort.equals("asc") ? Integer.compare(pf1.getPlanThisYear(), pf2.getPlanThisYear()) : Integer.compare(pf2.getPlanThisYear(), pf1.getPlanThisYear());
        }
        else if (sortBy.equals("planNextYear")) {
            return sort.equals("asc") ? Integer.compare(pf1.getPlanNextYear(), pf2.getPlanNextYear()) : Integer.compare(pf2.getPlanNextYear(), pf1.getPlanNextYear());
        }
        else
            return sort.equals("asc") ? Integer.compare(pf1.getId(), pf2.getId()) : Integer.compare(pf2.getId(), pf1.getId());
    }
}
