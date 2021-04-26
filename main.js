/*  $(document).ready(function() {
        $('#data-table').DataTable({
            "ajax": {
                "url": "./mumbai-data/vaccination-centers.json",
                "dataSrc": ""
            },
            scrollY: '70vh', // Scrollable table fixed top - display vertical height
            scrollCollapse: true, // Scrollable table fixed top
            paging: false, // Remove Paging
            "searching": false, // Hiding default Search Box
            "ordering": false,
            "info": false, // Remove info "Data Page 1 of 100"
            // "dom": '<"top"i>rt<"bottom"lp><"clear">', // Hiding default Search Box 2

            "columns": [{
                    "data": "sr"
                },
                {
                    "data": "ward"
                },
                {
                    "data": "vaccinationCentre"
                },
                {
                    "data": "facilityCategory"
                },
                {
                    "data": "functionalTomorrow"
                },
                {
                    "data": "remarks"
                }
            ]
        });
    }); 
    */

$(document).ready(function () {
  var groupColumn = 1;
  var table = $("#data-table").DataTable({
    ajax: {
      url: "./mumbai-data/vaccination-centers.json",
      dataSrc: "",
    },
    renderer: "bootstrap",

    searching: false,
    // scrollY: '70vh', // Scrollable table fixed top - display vertical height
    // scrollCollapse: true, // Scrollable table fixed top
    paging: false, // Remove Paging
    fixedHeader: true,
    ordering: true,
    info: false, // Remove info "Data Page 1 of 100"

    columns: [
      {
        data: "sr",
        searchable: false,
        // className: "text-center col-1",
        orderable: false,
        visible: false,
      },
      {
        data: "ward",
        searchable: false,
      },
      {
        data: "location",
        searchable: true,
        className: "col td-bg",
        orderable: false,
      },
      {
        data: "center_name",
        searchable: true,
        className: "col td-bg",
        orderable: false,
      },
      {
        data: "center_category",
        searchable: false,
        className: "col text-center td-bg",
        orderable: false,
      },
      {
        data: "available",
        searchable: false,
        className: "col text-center td-bg",
        orderable: false,
      },
      {
        data: "vaccine_name",
        searchable: false,
        className: "col td-bg",
        orderable: false,
      },
      {
        data: "remarks",
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

    createdRow: function (row, data, dataIndex) {
      if (data.available == "No") {
        $(row).addClass("text-muted available-no");
      }
    },
  });
});
