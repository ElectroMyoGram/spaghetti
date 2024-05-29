import numpy as np
import matplotlib.pyplot as plt


lapse_rate_def = {0: -6.5, 
                  11.0: 0.0, 
                  20.0: 1.0, 
                  32.0: 2.8, 
                  47.0: 0.0, 
                  51.0: -2.8, 
                  71.0: -2.0}


def get_values(g=9.81):
    T0 = 273 + 15
    R0 = 1.225
    M = 0.02896
    R = 8.314

    lapse_rate_keys = {k * 1000: v/1000 for k, v in lapse_rate_def.items()}

    def lapse_rate(h):
        for index, height in enumerate(lapse_rate_keys.keys()):
            if h < (height):
                return lapse_rate_keys[list(lapse_rate_keys.keys())[index-1]]
        return lapse_rate_keys[list(lapse_rate_keys.keys())[-1]]



    da = 80
    altitudes = np.linspace(0, 80000, 50)

    def air_density(alti):
        ans = []
        
        for h in alti:
            L = lapse_rate(h)
            if L != 0:
                term1 = (M * g) / (L * R)
                term2 = 1 - ( (L * h) / T0 )
                rho_term = R0 * (term2 ** term1)
                
            else:
                rho_term = R0 * np.exp(-( ( M * g * h) / (R * T0)))
            ans.append(rho_term)
        return ans
    # rho = []
    # T = T0
    # for i in altitudes:
    #     L = lapse_rate(i)
    #     T += L * (da / 1000)
    #     rho.append(T-273)
    rho = air_density(altitudes)
    return altitudes, rho