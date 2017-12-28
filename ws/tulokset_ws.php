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
    
    $tuloksentiedot = json_decode($data);
    
	$aikaleima = time();
    //--------------------------------------------------------------------------


    $metodi = $_SERVER['REQUEST_METHOD'];

    switch ($metodi) {
     
        case "GET" : $sql_lause = "SELECT * FROM omattulokset";
            break;
        
        case "POST" : $sql_lause = "INSERT INTO omattulokset (radan_id, pvm, tulos) VALUES ('".$tuloksentiedot->radan_id."',".$aikaleima.",".$tuloksentiedot->tulos.");";
            break;
        /*
        case "PUT" : $sql_lause = "";tuloksia ei voi muokata ettei harrasteta fiilunkia jälkikäteen...
            break;
        */
        case "DELETE" : $sql_lause = "DELETE FROM omattulokset WHERE id=".$tuloksentiedot->id;
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