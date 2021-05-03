$(document).ready(function () {
  // Hide Search
  $(document).on("preInit.dt", function (e, settings) {
    $("#data-table_filter").hide();
  });

  var groupColumn = 1; // Grouping Ward

  var table = $("#data-table").DataTable({
    ajax: {
      url:
        "https://spreadsheets.google.com/feeds/list/1O3v5jAmt_8JUyyK2NT_h33bFraTcYPHjmtD5Lkuk6VE/od6/public/values?alt=json",
      dataSrc: "feed.entry",
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
        data: "gsx$srno.$t",
        searchable: false,
        // className: "text-center col-1",
        orderable: false,
        visible: false,
      },
      {
        data: "gsx$ward.$t",
        searchable: false,
      },
      {
        data: "gsx$location.$t",
        searchable: true,
        className: "col td-bg",
        orderable: false,
      },
      {
        data: "gsx$nameofactivevaccinationcentre.$t",
        searchable: true,
        className: "col td-bg",
        orderable: false,
      },
      {
        data: "gsx$facilitycategory.$t",
        searchable: false,
        className: "col text-center td-bg",
        orderable: false,
      },
      {
        data: "gsx$functionalondate.$t",
        searchable: false,
        className: "col text-center td-bg",
        orderable: false,
        visible: false,
      },
      {
        data: "gsx$covaxincovishield.$t",
        searchable: false,
        className: "col td-bg",
        orderable: false,
      },
      {
        data: "gsx$remarks.$t",
        searchable: false,
        className: "col td-bg",
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
    order: [[groupColumn, "asc"]],
    drawCallback: function (settings) {
      var api = this.api();
      var rows = api
        .rows({
          page: "current",
        })
        .nodes();
      var last = null;

      api
        .column(groupColumn, {
          page: "current",
        })
        .data()
        .each(function (group, i) {
          if (last !== group) {
            $(rows)
              .eq(i)
              .before(
                '<tr class="group text-center"><td colspan="6"> Ward <span class="badge bg-danger">' +
                  group +
                  "</span></td></tr>"
              );

            last = group;
          }
        });
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
    },

    // Search End //

    /*
    // Not Available = Yes, No, EMPTY
    createdRow: function (row, data, dataIndex) {
      if (data.gsx$functionalondate.$t == "No") {
        $(row).addClass("text-muted status-no");
      }
      if (data.gsx$functionalondate.$t == "Stock Exhausted") {
        $(row).addClass("text-danger status-exhausted");
      }

      if (data.gsx$functionalondate.$t == "") {
        $(row).addClass("d-none");
      }
    },
    */
  });
});

// Location change of Search input

$(document).ready(function () {
  $("#data-table").dataTable();
  $("#data-table_filter input").removeClass("form-control-sm");
});

// Information Gathering from Google Sheet - Start

// ID of the Google Spreadsheet
var spreadsheetID = "1O3v5jAmt_8JUyyK2NT_h33bFraTcYPHjmtD5Lkuk6VE";

// Google Sheets - URL
var surl =
  "https://spreadsheets.google.com/feeds/list/" +
  spreadsheetID +
  "/2/public/values?alt=json";

$.getJSON(surl, function (data) {
  var sentry = data.feed.entry;

  $(sentry).each(function () {
    var todays_date = document.getElementById("todays-date");
    todays_date.innerHTML = this.gsx$todaysdate.$t;

    var centers_functional_status = document.getElementById(
      "centers-functional-status"
    );
    centers_functional_status.innerHTML = this.gsx$centersfunctionalstatus.$t;

    var last_updated_date = document.getElementById("last-updated-date");
    last_updated_date.innerHTML = "Last Updated: " + this.gsx$lastupdated.$t;

    var source_details = document.getElementById("source-details");

    if (this.gsx$source.$t !== "") {
      source_details.innerHTML =
        '<a class="nav-link" href="' +
        this.gsx$source.$t +
        '" target="_blank">Source</a>';
    }
    if (this.gsx$update1.$t !== "") {
      source_details.innerHTML +=
        '<a class="nav-link" href="' +
        this.gsx$update1.$t +
        '" target="_blank">Update 1</a>';
    }
    if (this.gsx$update2.$t !== "") {
      source_details.innerHTML +=
        '<a class="nav-link" href="' +
        this.gsx$update2.$t +
        '" target="_blank">Update 2</a>';
    }
    if (this.gsx$update3.$t !== "") {
      source_details.innerHTML +=
        '<a class="nav-link" href="' +
        this.gsx$update3.$t +
        '" target="_blank">Update 3</a>';
    }
  });
});

// Information Gathering from Google Sheet - End
