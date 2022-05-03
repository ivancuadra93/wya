import { useHistory } from 'react-router-dom';

import { EventPlanInfo, EventPlanId } from '../../interfaces';

interface EventPlanListProps {
  elementId: string;
  eventPlans: (EventPlanInfo & { eventPlanId: EventPlanId })[];
}

function sortEvents(
  events: (EventPlanInfo & { eventPlanId: EventPlanId })[]
): (EventPlanInfo & { eventPlanId: EventPlanId })[] {
  return events.sort((a, b) => {
    const aStart = Date.parse(a.startDate);
    const bStart = Date.parse(b.startDate);
    return aStart - bStart;
  });
}

export default function EventPlanList(props: EventPlanListProps): JSX.Element {
  const history = useHistory();
  const { elementId, eventPlans } = props;
  const eventList = sortEvents(eventPlans);

  return (
    <div id={elementId}>
      <h1 className="py-4 flex justify-center">Pending Events</h1>
      <ul className="space-y-3 pr-8">
        {eventList.map(({ eventPlanId, name }) => (
          <li
            key={eventPlanId}
            onClick={() => history.push(`/event-plans/${eventPlanId}`)}
            className="bg-white shadow overflow-hidden rounded-md px-6 py-4"
          >
            {/* Your content */}
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
