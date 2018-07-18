<?php
// my new SupportSoftwareList.php inside /home/www/sites/secure/Mohsen/backend
header("Access-Control-Allow-Origin: *");
class SupportSoftwareList {
  //private $registry;
  //private $db;

  // public function __construct() {
  //   //$this->registry = $registry;
  //   //$this->db = db::instance($registry);

  // }


  public function __construct(){
    //route to correct method for request handling
    if ($_SERVER['REQUEST_METHOD'] == "GET" && isset($_GET['action'])){
      switch ($_GET["action"]){
        case "getAllPrograms":
          $this->getAllPrograms();
          break;
        
        default:
          http_response_code(404);
      }
    } else if ($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['action'])){
      switch ($_POST["action"]){
        case "addSoftware":
          $this->addSoftware();
          break;
        // case "pushItemChange":
        //   $this->pushItemChange();
        //   break;
        case "deleteSoftware":
          isset($_POST['softwareName']) ? $this->deleteSoftware($_POST['softwareName']) : http_response_code(404);
          break;
        default:
          http_response_code(404);
      }
    }
    
  }

  public function deleteSoftware($software_name){
    // if (!user_is_logged_in()){
    //   http_response_code(401);
    //   exit();
    // }
    global $tbl_software_list;
    try{
      $db = new DatabaseConnection();
    }
    catch(Exception $e){
      $response = array("success" => false, "error_text" => "Could not establish connection");
      echo json_encode($response);
      exit;
    }

    $clean_software_name = $db->real_escape_string($software_name);
    $query = "DELETE FROM $tbl_software_list WHERE name=$clean_software_name";
    if (!$db->query($query)){
      $response = array("success" => false, "error_text" => "Database error deleting software item");
      echo json_encode($response);
      exit;
    }

    $response = array("success" => true);
    echo json_encode($response);
    exit;
  }

  public function addSoftware($software_name, $winOS, $macOS){
    global $tbl_software_list;
    // try{
    //   $db = new DatabaseConnection();
    //   $softwareName = $db->real_escape_string($_POST['softwareName']);
    //   $macOS = $db->real_escape_string($_POST['macOS']);
    //   $winOS = $db->real_escape_string($_POST['winOS']);    
    // }
    // catch(Exception $e){
    //   $response = array("success" => false, "error" => "Server Error Processing Form");
    //   echo json_encode($response);
    //   exit();
    // }
    $insert_query = "INSERT INTO $tbl_software_list
                     (name, win, mac)
                     VALUES ($software_name, '$winOS', '$macOS')";
                     
    // if(!$db->query($query)){
    // $response = array("success" => false,
    //                   "error"   => "Database insertion error");
    // }
    $db = new DatabaseConnection();
    return $db->query($insert_query);
  }

  public function getAllPrograms() {
    global $tbl_software_list;
    $query = "SELECT * FROM $tbl_software_list ORDER BY name";
    $db = new DatabaseConnection();
    $result = $db->query($query);
    $data = array();
    while ($row = $result->fetch_assoc()) {
      $data[] = $row;
    }
    echo json_encode($data, JSON_PRETTY_PRINT);
    //echo "Hello world!"; 
  }
}
?>

