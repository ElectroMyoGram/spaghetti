import * as THREE from 'three';


export class Earth{
    constructor(){
        this.radius = 1.0
        this.sphereTexture = new THREE.TextureLoader().load('/assets/textures/earth.jpg');
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 64, 32);
        this.material = new THREE.MeshBasicMaterial({ map: this.sphereTexture });
        this.earth_sphere = new THREE.Mesh(this.sphereGeometry, this.material);

        this.nlat = 180
        this.nlong = 360

        this.lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            opacity: 0.4,
            transparent: true
        });

        
    }

    generate_latitude_lines(n=180){
        const resolution = Math.PI / 100;

        let lines = [];
        for (let i = -n/2; i <= n/2; i++){
            let ypos = i / (n / 2) * this.radius;
            let points = [];
            let radius = Math.sqrt((this.radius **2) - (ypos ** 2))
            for (let angle=0; angle <= Math.PI * 2; angle += resolution){
                let zpos = Math.sin(angle) * radius;
                let xpos = Math.cos(angle) * radius;
                points.push(new THREE.Vector3(zpos, ypos, xpos));
            }
            let line_geometry = new THREE.BufferGeometry().setFromPoints( points );

            let line = new THREE.Line( line_geometry, this.lineMaterial );
            lines.push(line);
        }
        return lines;
    }

    generate_longitude_lines(n){
        const lineResolution = 400

        let lines = [];
        for (let angle = 0; angle < 2 * Math.PI; angle += (2 * Math.PI) / n){
            let points = [];
            for (let i = -lineResolution/2; i <= lineResolution/2; i++){
                let ypos = i / (lineResolution / 2) * this.radius;
                let curve_radius = Math.sqrt((this.radius **2) - (ypos ** 2));
                let xpos = Math.cos(angle) * curve_radius;
                let zpos = Math.sin(angle) * curve_radius;

                points.push(new THREE.Vector3(xpos, ypos, zpos));
            }
            
            let line_geometry = new THREE.BufferGeometry().setFromPoints( points );
            let line = new THREE.Line(line_geometry, this.lineMaterial)
            lines.push(line);
        }
        return lines;

    }
    get_wire_mesh(){

    }
}

