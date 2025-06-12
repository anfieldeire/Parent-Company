// When the parent company field on the nuvolo company form changes, a checkbox update_data is checked.  (via business rules)

// This is then used to flag companies and parent_data that need to have the parent company field on clinical models and clinical devices updated

// Data filter: companies of type manufacturer. Customer req = active or inactive it doesnt matter

 

// Data structure: parent instance is a dict containing each set of company data, parent_data is the array that holds all the records, each record in its own dict

// Once the data in the above two tables is updated, the company records are unchecked again

// Main function calls the other funtcions

 

function get_companies() {

 

// get the parent companies and the company pairs from the nuvolo company table and return that into parent_data (arr with dictionaries inside)

 

    var parent_data = [];

   

    var grc = new GlideRecord('x_nuvo_eam_company');

    grc.addQuery('u_parent_company', '!=', '');

    grc.addQuery('manufacturer', true);

    grc.addQuery('u_update_data', true);

    grc.query();

 

    while (grc.next()){

 

        var parent_instance = {};

 

        //global.JSUtil.logObject(parent_instance, ' NUV GH: parent instance start');

 

        var parent_name = grc.getDisplayValue('u_parent_company');

        var company_sysid = grc.getValue('sys_id');

 

        parent_instance = { "company_sysid": company_sysid, "parent_name": parent_name};

        //global.JSUtil.logObject(parent_instance, ' NUV GH: parent instance dict');

 

       

        parent_data.push(parent_instance);

 

       

    }

 

    //global.JSUtil.logObject(parent_data, 'Nuv GH: parent data1:' );

 

return parent_data; // an array containing multiple dicts

}

 

//get_companies();




function update_models(parent_data) {

 

    // updates populates the clinical model parent_company field based on a match with manufacturer  = company

 

   

    for (i=0; i< parent_data.length; i++){

 

        //global.JSUtil.logObject(parent_data[i].company_sysid, ' NUV GH: parent data dict0 ' );

 

        var grc = new GlideRecord('x_nuvo_eam_clinical_models');

        grc.addQuery('manufacturer', parent_data[i].company_sysid );

        grc.query();

        while (grc.next()){

 

                //global.JSUtil.logObject(parent_data[i].parent_name, ' NUV GH: parent data dict ' );

 

                grc.u_parent_company = parent_data[i].parent_name;

                grc.update();

 

        }

        global.JSUtil.logObject(parent_data[i].parent_name, ' NUV GH: update complete for parent name ' );

 

    }

 

}

//update_models();

 

function update_devices(parent_data){

 

    // updates populates the clinical device parent_company field based on a match with asset manufacturer  = company

 

    //global.JSUtil.logObject(parent_data, ' Nuv GH: update devices: arr all ' );

 

    for (i=0; i< parent_data.length; i++){

 

        var grd = new GlideRecord('x_nuvo_eam_clinical_devices');

        grd.addQuery('asset_manufacturer', parent_data[i].company_sysid );

        grd.query();

        //gs.info('NUV GH: row count: ' + grd.getRowCount());

 

        while (grd.next()) {

 

            //grd.u_parent_company = '';

            grd.u_parent_company = parent_data[i].parent_name;

            grd.update();

 

            }  

 

    }

}

//update_devices();

 

function uncheck_companies(parent_data){

 

    // Unchecks the parent_data field on the nuvolo company table

 

   

    for (i=0; i< parent_data.length; i++){

 

        var grc = new GlideRecord('x_nuvo_eam_company');

        grc.addQuery('sys_id', parent_data[i].company_sysid);

        grc.query();

 

            while (grc.next()){

 

                grc.u_update_data = false;

                grc.update();

 

            }

    }      

 

}




function main() {

 

    // This calls all the other functions. Parent data is an array, inside that a dictionary for each company and parent_company pair

 

   

    var parent_data = get_companies();

 

    update_models(parent_data);

 

    update_devices(parent_data);

 

    uncheck_companies(parent_data);

 

   

} main();

