function convert_to_latitude(y, h){
    return Math.asin(y / h);
}

function convert_to_longitude(x, z, earth_rotation){
    let ans
    if (x == 0){
        ans = 90 * (z / -Math.abs(z));
    }
    else {
        ans = Math.atan2(-z, x); 
    }

    ans -= deg2rad(earth_rotation % (2 * Math.PI));
    return ans;
}

function convert_to_y(lat, h){
    return h * Math.sin(deg2rad(lat));
}

function convert_to_xz(long, lat, earth_rotation, h){
    long += rad2deg(earth_rotation) % 360;
    let x_mod = 1; let z_mod = 1;
    if (long > 0){
        z_mod = -1;
    }
    if (long > 90 || long < -90){
        long = 180 - Math.abs(long);
        x_mod = -1;
    }

    
    h = h * Math.cos(deg2rad(lat));
    z = h * Math.abs(Math.sin(deg2rad(long))) * z_mod;
    x = h * Math.abs(Math.cos(deg2rad(long))) * x_mod;
    return [x, z];

}



function deg2rad(theta){
    return theta * (Math.PI / 180);
}

function rad2deg(theta){
    return theta * (180 / Math.PI);
}


function convertToCSV(objArray) {
    const array = [Object.keys(objArray[0])].concat(objArray);

    return array.map(row => {
        return Object.values(row).map(value => {
            return typeof value === 'object' ? JSON.stringify(value) : value;
        }).toString();
    }).join('\n');
};

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
    
    window.URL.revokeObjectURL(url);
};