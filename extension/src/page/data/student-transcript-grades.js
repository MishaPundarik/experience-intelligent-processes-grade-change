/* eslint-disable max-depth */
// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.


import log from 'loglevel';
const logger = log.getLogger('default');


export const resourceName = process.env.PIPELINE_GET_STUDENT_TRANSCRIPT_GRADES;
export async function fetchStudentTranscriptGrades({ authenticatedEthosFetch, queryKeys, signal }) {
    if (!process.env.PIPELINE_GET_STUDENT_TRANSCRIPT_GRADES) {
        const message = 'PIPELINE_GET_STUDENT_TRANSCRIPT_GRADES is not defined in environment!!!';
        console.error(message);
        throw new Error(message);
    }
    const { cardId, cardPrefix, studentGuid = '', academicPeriodId = '' } = queryKeys;

    try {
        const start = new Date();

        if (!studentGuid || !academicPeriodId) {
            return {
                data: undefined
            }
        }

        const searchParameters = new URLSearchParams({
            cardId,
            cardPrefix,
            studentGuid,
            academicPeriodId
        }).toString();

        const response = await authenticatedEthosFetch(`${resourceName}?${searchParameters}`, {
            headers: {
                Accept: 'application/vnd.hedtech.integration.v0.0.1+json'
            },
            signal
        });
        const data = await response.json();
        const end = new Date();
        logger.debug(`fetch ${resourceName} time: ${end.getTime() - start.getTime()}`);

        if (data?.errors) {
            return {
                dataError: data.errors,
                data: []
            }
        }

        return {
            data
        };
    } catch (error) {
        logger.error('unable to fetch data: ', error);
        throw error;
    }
}
