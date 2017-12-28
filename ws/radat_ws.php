<?php
	header("Access-Control-Allow-Origin: *"); // CORS
	header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header("Content-type: application/json");


    $dns = "mysql:host=localhost;dbname=frisbeegolf;";
    $tunnus = "root";
    $salasana = "";

    try {
            $yhteys = new PDO($dns, $tunnus, $salasana);
    } catch (PDOException $e){
            die("Virhe: ".$e->getMessage());
    }

    $yhteys->exec("SET NAMES utf8");

    //---------------------------Vastaanotto------------------------------------
    $data = file_get_contents("php://input");
    
    $radantiedot = json_decode($data);
    
    //--------------------------------------------------------------------------


    $metodi = $_SERVER['REQUEST_METHOD'];

    switch ($metodi) {
     
        case "GET" : $sql_lause = "SELECT * FROM radat";
            break;
        
        case "POST" : $sql_lause = "INSERT INTO radat (radan_nimi, vaylat, par) VALUES ('".$radantiedot->radan_nimi."',".$radantiedot->vaylat.",".$radantiedot->par.");";
            break;
        
        case "PUT" : $sql_lause = "UPDATE radat SET radan_nimi = '".$radantiedot->radan_nimi."', vaylat = ".$radantiedot->vaylat.", par = ".$radantiedot->par." WHERE id =".$radantiedot->id;
            break;
        
        case "DELETE" : $sql_lause = "DELETE FROM radat WHERE id=".$radantiedot->id;
            break;
        
        default : $paluuviesti = "Webservice vastaa ei tuettu metodi :".$metodi;
            break;
    }

    $kysely = $yhteys->prepare($sql_lause);

    $kysely->execute();

    //----------------------"ns.Paluuviesti"------------------------------------

    echo json_encode($kysely->fetchAll(PDO::FETCH_ASSOC));
    //--------------------------------------------------------------------------
    
    
    
    
    
    
    
?>