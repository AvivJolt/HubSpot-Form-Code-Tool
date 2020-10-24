function getValues() {
    var form = document.getElementById('myForm');
    if (!form.reportValidity()) {
        return false
    }
    var formId = document.getElementById('formId').value;
    var isGa = document.getElementById('gaClientId').checked;
    var isQuery = document.getElementById('isQuery').checked;
    var redirectURL = document.getElementById('redirectURL').value;
    var gaPortalId = document.getElementById('gaPortalId').value;
    var codeStart = `
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2-legacy.js"></script>
    <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2.js"></script>
    <script>`;
    var jsCode = `hbspt.forms.create({
      portalId: "3992237",
      formId: "${formId}"`;
    if (isGa && !isQuery) {
        jsCode = jsCode + `,

    onFormReady: function($form) { 
        var clientId = getClientId();
        $form.find('input[name="ga_client_id"]').val(clientId).change(); 
      },
      onFormSubmit: function($form) {
        var clientId = getClientId(); 
        $form.find('input[name="ga_client_id"]').val(clientId).change(); 

        
  } 
    `};
    if (isQuery && !isGa) {
        jsCode = jsCode + `,
    onFormSubmit: function($form) {
    setTimeout( function() {
        var formData = $form.serialize();
        window.location = "${redirectURL}?email=" + $form.find('input[name="email"]').val();
    }, 250 ); 
    
  } 
    `};
    if (isQuery && isGa) {
        jsCode = jsCode + `,


    onFormReady: function($form) { 
        var clientId = getClientId();
        $form.find('input[name="ga_client_id"]').val(clientId).change(); 
      },
      onFormSubmit: function($form) {
        var clientId = getClientId(); 
        $form.find('input[name="ga_client_id"]').val(clientId).change(); 
    
    
    setTimeout( function() {
                var formData = $form.serialize();
                window.location = "${redirectURL}?email=" + $form.find('input[name="email"]').val();
            }, 250 ); 
    
    
      } 
    `};
    jsCode = jsCode + `
     });`;
    if (isGa) {
        jsCode = jsCode + `function getClientId() {
    try {
      var trackers = ga.getAll();
      var i, len;
      for (i = 0, len = trackers.length; i < len; i += 1) {
        if (trackers[i].get('trackingId') === "${gaPortalId}") { 
          return trackers[i].get('clientId');
        }
      }
     } catch(e) {} 
     return '';
  }
  `};


    var codeEnd = `</script>`;
    var pree = document.getElementById('pre');
    pree.textContent = codeStart + jsCode + codeEnd;
    document.querySelector("div.hbspt-form")?.remove();
    eval(jsCode);
}

function yesnoQueryCheck(that) {
    if (that.checked == true) {
        document.getElementById("queryYes").style.display = "block";
        document.getElementById("redirectURL").required = true;
    } else {
        document.getElementById("queryYes").style.display = "none";
        document.getElementById("redirectURL").required = false;
    }
}
function yesnoGACheck(that) {
    if (that.checked == true) {
        document.getElementById("gaYes").style.display = "block";
        document.getElementById("gaPortalId").required = true;
    } else {
        document.getElementById("gaYes").style.display = "none";
        document.getElementById("gaPortalId").required = false;
    }
}
