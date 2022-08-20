var api_key = "AIzaSyBX9nWaFWJ86YDMgm4gCGtsyoC4joY17mg";
var spreadsheet_id = "1O3v5jAmt_8JUyyK2NT_h33bFraTcYPHjmtD5Lkuk6VE";
var sheet1_name = "mumbaivaccinationcenters";
var sheet1_range = "A2:Y932";
var sheet2_name = "infoo";
var sheet2_range = "A1:D7";

$(document).ready(function () {
  // Hide Search
  $(document).on("preInit.dt", function (e, settings) {
    $("#data-table_filter").hide();
  });

  var groupColumn = 1; // Grouping Ward

  var table = $("#data-table").DataTable({
    ajax: {
      url:
        "https://sheets.googleapis.com/v4/spreadsheets/" +
        spreadsheet_id +
        "/values/" +
        sheet1_name +
        "!" +
        sheet1_range +
        "?alt=json&key=" +
        api_key,

      dataSrc: "values",
    },
    searching: true, // Enable Search
    // scrollY: '70vh', // Scrollable table fixed top - display vertical height
    // scrollCollapse: true, // Scrollable table fixed top
    paging: false, // Remove Paging
    fixedHeader: true, // Sticky Header
    ordering: true,
    info: false, // Remove info "Data Page 1 of 100"
    autoWidth: false,
    columns: [
      {
        data: 0, // Sr No
        searchable: false,
        // className: "text-center col-1",
        orderable: false,
        visible: false,
      },
      {
        data: 1, // Ward
        searchable: false,
      },
      {
        data: 2, // Location
        searchable: true,
        className: "col",
        orderable: false,
      },
      {
        data: 3, // Name of active vaccination centre
        searchable: true,
        className: "col",
        orderable: false,
      },
      {
        data: 4, // Facility Category
        searchable: false,
        className: "col-lg-1 text-center",
        orderable: false,
      },
      {
        data: 5, // Functional on (Date)?
        searchable: false,
        className: "col-lg-1 text-center status",
        orderable: false,
      },
      {
        data: 7, // Vaccine
        searchable: false,
        className: "col-lg-1",
        orderable: false,
        render: function (data, type, row) {
          return '<span class="vaccine-text">' + data + "</span>";
        },
      },
      {
        data: 8, // Remarks
        searchable: false,
        className: "col",
        orderable: false,
      },
    ],
    // Grouping Ward Starts //
    columnDefs: [
      {
        visible: false,
        targets: groupColumn,
      },
    ],
    // order: [[groupColumn, 'asc']],

    rowGroup: {
      dataSrc: 1,
      className: "group text-center",
      emptyDataGroup: null,
      endRender: null,
      startRender: function (rows, group) {
        var count = 0;
        rows.every(function () {
          if (!$(this.node()).hasClass("d-none")) {
            count++;
          }
        });
        return count === 0
          ? $("<tr hidden />")
          : $("<tr/>").append('<td colspan="6">Ward <span class="ward-name">' + group + "</span></td>");
      },
    },
    // Grouping Ward Ends //

    // Search Start //

    initComplete: function () {
      $("#data-table_filter").detach().appendTo("#search-area");

      $("#data-table_filter").show();
    },
    language: {
      search: "",
      searchPlaceholder: "Search Location or Center Name...",
      processing: true,
      emptyTable: "No Data Available",
      // zeroRecords: "No Data Available",
    },

    // Search End //

    // Not Available = Yes, No, EMPTY, 18-44
    createdRow: function (row, data, dataIndex) {
      if (data[6] === "No") {
        $(row).addClass("text-muted status-no d-none");
      }
      if (data[6] === "Stock Exhausted") {
        $(row).addClass("status-exhausted");
      }

      if (data[6] === "") {
        $(row).addClass("d-none");
      }
      if (data[6] === "18+") {
        $(row).addClass("status-age18");
      }

      // Covishield, Covaxin and Both
      if (data[7] === "Covishield") {
        $("td", row).eq(4).addClass("vaccine-covishield");
      }
      if (data[7] === "Covaxin") {
        $("td", row).eq(4).addClass("vaccine-covaxin");
      }
      if (data[7] === "Both") {
        $("td", row).eq(4).addClass("vaccine-both");
      }
    },
  });
});

// Location change of Search input

$(document).ready(function () {
  $("#data-table").dataTable();
  $("#data-table_filter input").removeClass("form-control-sm");
});

// Information Gathering from Google Sheet - Start

// ID of the Google Spreadsheet

// Google Sheets - URL
var url2 =
  "https://sheets.googleapis.com/v4/spreadsheets/" +
  spreadsheet_id +
  "/values/" +
  sheet2_name +
  "!" +
  sheet2_range +
  "?alt=json&key=" +
  api_key;

$.getJSON(url2, function (data) {
  var sentry = data.values;
  var centers_functional_status = document.getElementById("centers-functional-status");
  for (var i = 1; i < 4; i++) {
    if (data.values[1][i] !== "") {
      centers_functional_status.innerHTML +=
        '<ul class="centers-details"><li class="centers-details-item">' + data.values[1][i] + "</li></ul>";
    }
  }
  $(sentry).each(function () {
    var todays_date = document.getElementById("todays-date");
    if (data.values[0][1] !== "") {
      todays_date.innerHTML = data.values[0][1]; //Today's Date
    }
    var last_updated_date = document.getElementById("last-updated-date");
    if (data.values[2][1] !== "") {
      last_updated_date.innerHTML = "Last Updated: " + data.values[2][1]; // Last Updated
    }

    var source_details = document.getElementById("source-details");

    if (data.values[3][1] !== "") {
      source_details.innerHTML = '<a class="nav-link" href="' + data.values[3][1] + '" target="_blank">Source</a>';
    }
    if (data.values[4][1] !== "") {
      source_details.innerHTML += '<a class="nav-link" href="' + data.values[4][1] + '" target="_blank">Update 1</a>';
    }
    if (data.values[5][1] !== "") {
      source_details.innerHTML += '<a class="nav-link" href="' + data.values[5][1] + '" target="_blank">Update 2</a>';
    }
    if (data.values[6][1] !== "") {
      source_details.innerHTML += '<a class="nav-link" href="' + data.values[6][1] + '" target="_blank">Update 3</a>';
    }
  });
});

// Information Gathering from Google Sheet - End

//check
