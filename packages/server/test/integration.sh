#!/usr/bin/env sh

testEquals() {
    response=$1; jqDSL=$2; expected=$3;

    result=$(echo "${response}" | jq -r "${jqDSL}")

    [ "${result}" = "${expected}" ] || {
        >&2 echo "TEST FAILED:";
        >&2 echo " --> Ran: ${jqDSL}";
        >&2 echo " --> Expected: ${expected}";
        >&2 echo " --> Got: ${result}";
        exit 1;
    }

    printf "."
}

printf "\nGET /bottles > "
r=$(curl -s -XGET localhost:5000/bottles)
testEquals "${r}" 'type' 'object';
testEquals "${r}" 'length' '1'
testEquals "${r}" '.bottles | type' 'array'
testEquals "${r}" '.bottles[0] | length' '5'
testEquals "${r}" '.bottles[0].id' '1'
testEquals "${r}" '.bottles[0].name | type' 'string'
testEquals "${r}" '.bottles[0].max_liters | type' 'number'
testEquals "${r}" '.bottles[0].current_liters | type' 'number'
testEquals "${r}" '.bottles[0].attached_device_id | type' 'number'

printf "\nGET /bottles/:id > "
r=$(curl -s -XGET localhost:5000/bottles/1)
testEquals "${r}" 'type' 'object'
testEquals "${r}" 'length' '5'
testEquals "${r}" '.id' '1'
testEquals "${r}" '.name | type' 'string'
testEquals "${r}" '.max_liters | type' 'number'
testEquals "${r}" '.current_liters | type' 'number'
testEquals "${r}" '.attached_device_id | type' 'number'
