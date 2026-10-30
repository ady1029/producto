package cu.aica.product_resource.utils;

public class MathRound {

    public static Double fourFixeds(Double number){
        return round(number, 10000);
    }

    public static Double threeFixeds(Double number){
        return round(number, 1000);
    }

    public static Double twoFixeds(Double number){
        return round(number, 100);
    }

    public static Double oneFixed(Double number){
        return round(number, 10);
    }

    private static Double round(Double number, Integer fixeds){
        return (double) Math.round(number*fixeds)/fixeds;
    }
}
