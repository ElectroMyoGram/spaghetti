function convert_to_latitude(y, h){
    return Math.asin(y / h);
}

function convert_to_longitude(x, z, earth_rotation){
    let ans
    if (x == 0){
        ans = 90 * (z / -Math.abs(z));
    }
    else {
        ans =  Math.atan(-z / x); 
    }
    if (x < 0){
        ans += (Math.PI/2 * Math.abs(ans))
    }

    ans -= earth_rotation % (2 * Math.PI);
    return ans;
}

function deg2rad(theta){
    return theta * (Math.PI / 180);
}

function rad2deg(theta){
    return theta * (180 / Math.PI);
}