class AppUtil {
    static showMsg = (msg, type = "info", duration = 3000) => {
      let backgroundColor;
      switch (type) {
        case "success":
          backgroundColor = "linear-gradient(to right, #00b09b, #96c93d)";
          break;
        case "error":
          backgroundColor = "linear-gradient(to right, #ff416c, #ff4b2b)";
          break;
        default:
          backgroundColor = "linear-gradient(to right, #4b6cb7, #182848)";
      }
      Toastify({
        text: msg,
        duration: duration,
        gravity: "top",
        position: "center",
        style: {
          background: backgroundColor,
        },
      }).showToast();
    };
  
    static showLoadingMask = (show) => {
      $("#loadingMask").modal({
        backdrop: "static",
        keyboard: false,
      });
  
      if (show) {
        $("#loadingMask").show();
      } else {
        $("#loadingMask").hide();
      }
    };
  
    static isNotEmpty = (value) => {
      return value !== null && value !== undefined && value !== "" && value.length !== 0;
    };
  }
  
  $(document).ready(() => {
    $("#submit").click(() => {
      let addressInput = $("#address_input").val();
      if (addressInput === "") {
        AppUtil.showMsg("Please input address", "error");
        return;
      }
      AppUtil.showLoadingMask(true);
      let addressInputs;
      if (addressInput.includes("\n")) {
        addressInputs = addressInput.split("\n");
      } else {
        addressInputs = [addressInput];
      }
  
      console.log(addressInputs.length);
      
      $.ajax({
        type: "POST",
        url: `/api/parse`,
        data: JSON.stringify({ address: addressInputs }),
        contentType: "application/json",
        success: (data) => {
          const svgs = data.split("@@");
          const reusltDiv = $("#result-content");
          reusltDiv.empty();
          let number = 0;
          svgs.forEach((svg) => {
            reusltDiv.append(`<div>
            <div style="font-size: 15px; font-weight: bold;">Result ${++number}</div>
            <div>${svg}</div>
            </div>
            `);
          })
          AppUtil.showLoadingMask(false);
        },
        error: (error) => {
          AppUtil.showMsg("Error when parsing address", "error");
          AppUtil.showLoadingMask(false);
        },
      });
  
    });
  });
  