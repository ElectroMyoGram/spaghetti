import * as THREE from 'three';


export class Earth{
    constructor(){
        //defines some class constants
        this.radius = EARTH_RADIUS
        this.sphereTexture = new THREE.TextureLoader().load('/assets/textures/earth.jpg');
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 64, 32);
        this.material = new THREE.MeshBasicMaterial({ map: this.sphereTexture });
        this.earth_sphere = new THREE.Mesh(this.sphereGeometry, this.material);
        this.earth_sphere.name = 'earth'



        //material for the longitude/latitude lines
        this.lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            opacity: 0.4,
            transparent: true
        });

        this.rotation = 0;

        this.angle = 0;
        this.period = 3600 * 24 * 365

        const map = new THREE.TextureLoader().load( '/assets/textures/blue_cricle.png' )
        this.sprite_material = new THREE.SpriteMaterial({
            color: 0x0000FF,
            sizeAttenuation: false
        });
        this.sprite = new THREE.Sprite(this.sprite_material);
        this.sprite.scale.set(0.02,0.02, 1.0);

        // this.earth_sphere.rotateZ(-deg2rad(EARTH_AXIS_OF_ROTATION));
        
        this.trailVertices = [];
        this.trailGeometry = new THREE.BufferGeometry().setFromPoints(trailVertices);
        this.trailMaterial = new THREE.LineBasicMaterial({color : 0xffffff});
        this.trailLine = new THREE.Line(trailGeometry, trailMaterial)
        
    }

    //just uses some trig to iteratively generate a bunch of lines of latitude
    generate_latitude_lines(n=180){
        const resolution = Math.PI / 100; //number of points sampled in each line

        let lines = [];
        for (let i = -n/2; i <= n/2; i++){//where n is essentially number of lines so loops from bottom of earth to top making a horizontal circle at each height
            let ypos = i / (n / 2) * this.radius;
            let points = [];
            let radius = Math.sqrt((this.radius **2) - (ypos ** 2))
            for (let angle=0; angle <= Math.PI * 2; angle += resolution){
                let xpos = Math.sin(angle) * radius;
                let zpos = Math.cos(angle) * radius;
                points.push(new THREE.Vector3(xpos + this.earth_sphere.position.x, ypos + this.earth_sphere.position.y, zpos + this.earth_sphere.position.z));
            }
            let line_geometry = new THREE.BufferGeometry().setFromPoints( points );

            let line = new THREE.Line( line_geometry, this.lineMaterial );
            lines.push(line);
        }
        return lines;
    }

    // again just uses trig to iterative generate the longitude lines
    generate_longitude_lines(n){
        const lineResolution = 400 //number of points sampled in each line

        let lines = [];
        for (let angle = 0; angle < 2 * Math.PI; angle += (2 * Math.PI) / n){
            let points = [];
            for (let i = -lineResolution/2; i <= lineResolution/2; i++){
                let ypos = i / (lineResolution / 2) * this.radius;
                let curve_radius = Math.sqrt((this.radius **2) - (ypos ** 2));
                let xpos = Math.cos(angle) * curve_radius;
                let zpos = Math.sin(angle) * curve_radius;

                points.push(new THREE.Vector3(xpos + this.earth_sphere.position.x, ypos + this.earth_sphere.position.y, zpos + this.earth_sphere.position.z));
            }
            
            let line_geometry = new THREE.BufferGeometry().setFromPoints( points );
            let line = new THREE.Line(line_geometry, this.lineMaterial)
            lines.push(line);
        }
        return lines;

    }

    check_mouse_intersection(mousex, mousey, window, camera){
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        pointer.x = (mousex / window.innerWidth) * 2 -1;
        pointer.y = - (mousey / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera( pointer, camera );
        let intersects = raycaster.intersectObject( this.earth_sphere );
        if (intersects.length > 0){
            return intersects[0]
        }
        else{
            return null;
        }
    }
    calculate_radius(theta, a, e){
        return (a * ( 1- (e**2))) / (1 - e * Math.cos(theta))
    }


    iterate(dt){
        this.angle += (dt / this.period) * Math.PI * 2;
        this.orbital_radius = this.calculate_radius(this.angle, planetary_data.earth.aAU * AU, planetary_data.earth.ecc)
        let x = this.orbital_radius * Math.cos(this.angle)
        let z = this.orbital_radius * Math.sin(this.angle)
        let y = x * Math.sin(planetary_data.earth.beta)
        x = x * Math.cos(planetary_data.earth.beta)

        this.position = new THREE.Vector3(x, y, z)
        this.earth_sphere.position.set(x, y, z);
        this.sprite.position.set(x, y, z);
    }



}

