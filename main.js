$(document).ready(function () {
  var groupColumn = 1;
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

    // Search Start //

    initComplete: function () {
      $("#data-table_filter").detach().appendTo("#search-area");
    },
    language: {
      search: "",
      searchPlaceholder: "Search Location or Center Name...",
    },

    // Search End //

    // Not Available = Yes, No
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
  });

  /*  Search Single Column
      $("#mySearch").on("keyup click", function () {
        table.column(2).search("^" + $(this).val() + "$", true);
        if (table.page.info().recordsDisplay != 1) {
          table.column(2).search("^" + $(this).val(), true);
        }
    
        table.draw();
      }); */
});

// Location change of Search input

$(document).ready(function () {
  $("#data-table").dataTable();
  $("#data-table_filter input").removeClass("form-control-sm");
});
