

export class Atmosphere{
    constructor(){
        this.lapse_rate_keys = Object.keys(LAPSE_RATE);
        this.lapse_rate_val = Object.values(LAPSE_RATE);
    }

    get_lapse_rate(h){
        for (let i = 0; i < this.lapse_rate_keys.length; ++i){

            if ((h / 1000) < this.lapse_rate_keys[i]){
                return this.lapse_rate_val[i-1];
            }

        }
        return null;
    }

    checkPower(x, y) {
        if (x > 0 || Math.round(y) == y) {
          return Math.pow(x, y)
        } else {
          var r = -1 * Math.pow(-x, y);
          if( Math.pow( r, 1/y) == x) 
            return r;
          else 
            return NaN;
        }
      }

    return_density(h){
        let L = this.get_lapse_rate(h);

        let term1 = (M * G) / (L * R);
        let term2 = 1 - ((L * h) / T0);
        
        let rho = (L != 0) ? R0 * (term2 ** term1) : R0 * Math.exp(-(M * G * h) / (R * T0))

        return rho;

    }
}