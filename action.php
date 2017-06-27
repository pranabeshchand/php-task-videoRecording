<?php

 // header('Content-type: application/json');
 
ini_set('display_errors',0); ini_set('display_startup_errors',0); //error_reporting(E_ALL);
 class action
 {
  public $DB_con;
  public $DBhost ='localhost';
  public $DBuser = 'root';
  public $DBPass = 'mim';
  public $DBname = 'task';
  public function __construct(){
        try{
      
      $this->DB_con = new PDO("mysql:host=".$this->DBhost.";dbname=".$this->DBname,$this->DBuser,$this->DBPass);
      
     }catch(PDOException $e){
      
      die($e->getMessage());
     
     }
      
  }
  public function checkEamil($email = null){  
     try{
     	if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
		  $response['msg'] = "Please enter a valid email address";
          $response['error'] = 2; 
		}else{
			 $rows = $this->DB_con->query("SELECT * from users where email='".$_POST['email']."'");
		     $count =$rows->rowCount();
		      // $stmt =  $rows->fetch(PDO::FETCH_NUM);  
		      if ($count == 1) {
		        $response['msg'] = "Email already exist";
		        $response['error'] = 0;
		        } else {
		          $response['msg'] = "Valid Email";
		          $response['error'] = 1; 
		        } 
		} 
      } catch(PDOException $e){
        $response['error'] = $e->getMessage(); 
      }
      return $response; 
  } 
  public function userSignup(){
    try{   
      $img = $_POST['profilepic'];
      $img = str_replace('data:image/jpeg;base64,', '', $img);
      $img = str_replace(' ', '+', $img);
      $data = base64_decode($img);
      $fileName = uniqid() . '.jpeg';
      $file = 'uploads/'.$fileName; 
      $success = file_put_contents($file, $data);
      // print $success ? $file : 'Unable to save the file.';
       
      $hash_password= hash('sha256', $_POST['password']);
    $stmt = $this->DB_con->prepare('INSERT INTO users(name,email,password,profilepic,mobileno) VALUES(:name, :email, :pass, :profilepic, :mobile)');
    $stmt->bindParam(':name', $_POST['name']);
    $stmt->bindParam(':email', $_POST['email']);
    $stmt->bindParam(':pass', $hash_password);
    $stmt->bindParam(':profilepic', $fileName);
    $stmt->bindParam(':mobile', $_POST['mobile']);
    $stmt->execute();
    if ($stmt->rowCount() == 1) {
        @$this->emailFun($_POST['email'], $_POST['name']);
         $response['error'] = 1;
         $response['msg'] = 'registered sucessfully, you may login now';
        } else { 
          $response['error'] = 0; // could not register
         $response['msg'] = 'could not register, try again later';
        } 
        
      } catch(PDOException $e){
        $response['error'] = $e->getMessage();
      }
      return $response;
  }
  function emailFun($to = null, $name = null){ 
    $subject = "User Registration";

    $message = "
    <html>
    <head>
    <title>HTML email</title>
    </head>
    <body>
    <p> Hello <br/>".$name." Your Account created Successfully</p>
    <table>
    <tr>
    <th>Firstname</th>
    <th>Lastname</th>
    </tr>
    <tr>
    <td>John</td>
    <td>Doe</td>
    </tr>
    </table>
    </body>
    </html>
    ";

    // Always set content-type when sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    // More headers
    $headers .= 'From: <pranabesh.chand@gmail.com>' . "\r\n"; 

    mail($to,$subject,$message,$headers);
    return true;
  }
  public function loginUser(){
    try{
      $hash_password= hash('sha256', $_POST['password']);  
    $stmt = $this->DB_con->prepare("SELECT id,name,email FROM users WHERE (name=:email or email=:email) AND password=:password"); 
    $stmt->bindParam("email", $_POST['user_email'],PDO::PARAM_STR) ;
    $stmt->bindParam("password", $hash_password,PDO::PARAM_STR) ;
    $stmt->execute();
    $count=$stmt->rowCount(); 
    $data=$stmt->fetch(PDO::FETCH_OBJ);
    if($count == 1){
         $response['error'] = 1;
         $response['msg'] = 'Login Success';
         $response['unserInfo'] = $data;
        } else { 
          $response['error'] = 0; // could not register
         $response['msg'] = 'Login Failed';
      } 
  } catch(PDOException $e){
    $response['error'] = $e->getMessage();
  }
  return $response;
 }
 public function saveRecording(){
  try{
    print_r($_POST['vname']);
        foreach(array('video', 'audio') as $type) {
        if (isset($_FILES["${type}-blob"])) {
        
            echo 'uploads/';
            
            $fileName = $_POST["${type}-filename"];
            $uploadDirectory = 'uploads/'.$fileName;
            
            if (!move_uploaded_file($_FILES["${type}-blob"]["tmp_name"], $uploadDirectory)) {
                echo(" problem moving uploaded file");
            }else{
                $stmt = $this->DB_con->prepare('INSERT INTO recording(userId,vname,vlocation) VALUES(:userId, :vname, :vlocation)');
            $stmt->bindParam(':userId', $_GET['userId']);
            $stmt->bindParam(':vname', $_GET['vname']);
            $stmt->bindParam(':vlocation', $fileName);
            // print_r($stmt);
            $stmt->execute();
            if ($stmt->rowCount() == 1) {
                 $response['error'] = 1;
                 $response['msg'] = 'file saved sucessfully';
                } else { 
                $response['error'] = 0; // could not register
               $response['msg'] = 'could not save file';
               } 
            }
             
         }
    }
   }catch(PDOException $e){
    $response['error'] = $e->getMessage();
  }
  return $response;
 }
 public function videoScreening(){
 	try{
 		$rows = $this->DB_con->query("select * from recording order by id desc");
		     // $count =$rows->rowCount();
		      $stmt =  $rows->fetchAll(PDO::FETCH_ASSOC);   
		      foreach ($stmt as $stmts) {
		      	$stmts['vlocation'] = '/task/uploads/'.$stmts['vlocation']; 
            if(empty($stmts['vname'])){
              $stmts['vname'] = "Unknown Name";
            }
		      	$list[] = $stmts;
		       }  
		      if ($stmts) {
		      	$response['data']['list'] = $list;
		        $response['data']['msg1'] = "List of Videos";
		        $response['data']['err'] = 1;
		        } else {
		          $response['data']['msg1'] = "No List found";
		          $response['data']['err'] = 0; 
		        } 
		    } catch(PDOException $e){
		    	$response['err'] = $e->getMessage();
		    }
		    return $response;
    }
 public function viewVideo($id){
  try{
    $row = $this->DB_con->query("select * from recording where id=".$id);
    $resp = $row->fetch(PDO::FETCH_ASSOC);
    if($resp){
      if(empty($resp['vname'])){
        $resp['vname'] = "Unknown Name";
      }
      $resp['vlocation'] = '/task/uploads/'.$resp['vlocation']; 
      $response['video'] = $resp;
      $response['message'] = "valid video";
      $response['errs'] = 1;
    }else{
      $response['message'] = "Invalid video";
      $response['errs'] = 0;
    } 
  }catch(PDOException $e){
    $response['err'] = $e->getMessage();
  }
  return $response;
 }   
 public function deleteVideo($id= null, $userId = null){
  try{
    $row = @$this->DB_con->query("select vlocation from recording where id=".$id." and userId =".$userId);
    $resp = @$row->fetch(PDO::FETCH_ASSOC);
    $stmt = @$this->DB_con->exec("delete from recording where id= ".$id." and userId =".$userId);
    // print_r($stmt); 
    // $stmt =1;
    if(@$stmt){ 
      $file = @'uploads/'.$resp['vlocation'];
      // $file ="uploads/6634688453542797.webm";
      @unlink($file);  
      $response['message'] = "Deleted Successfully";
      $response['errs_del'] = 1;
    }else{
      $response['message'] = "Delete Failed because this is not your video";
      $response['errs_del'] = 0;
    } 
  }catch(PDOException $e){
    $response['err'] = $e->getMessage();
  }
  return $response;
 }
}

$obj = new action();
 
if($_GET['checkemail'] == 'checkemail'){ 
 echo json_encode($obj->checkEamil()); 
}
if($_GET['signup'] == 'signup'){ 
 echo json_encode($obj->userSignup()); 
}
if($_GET['login'] == 'login'){ 
 echo json_encode($obj->loginUser()); 
}
if($_GET['video'] == 'video'){ 
 echo json_encode($obj->saveRecording()); 
}
if($_GET['videolist'] == 'videolist'){ 
 echo json_encode($obj->videoScreening()); 
}
if($_GET['viewVideo'] == 'viewVideo'){ 
 echo json_encode($obj->viewVideo($_GET['id'])); 
}
if($_GET['deleteVideo'] == 'deleteVideo'){ 
 echo json_encode($obj->deleteVideo($_GET['id'])); 
}